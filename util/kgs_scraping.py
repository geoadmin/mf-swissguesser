#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import os
import sys
import csv
import httplib2
from bs4 import BeautifulSoup
from bs4 import UnicodeDammit

from htmlentitydefs import codepoint2name as entities


layers = ['ch.babs.kulturgueter']

# https://api3.geo.admin.ch/rest/services/api/MapServer/ch.babs.kulturgueter/7?returnGeometry=false&lang=de
# url =
# http://mf-chsdi3.int.bgdi.ch/main/wsgi/rest/services/all/MapServer/ch.swisstopo.lubis-luftbilder_farbe/19982271021945/extendedHtmlPopup


def get_html(id, lang='de'):
    h = httplib2.Http(".cache")

    for layer in layers:
        url = "http://api3.geo.admin.ch/main/wsgi/rest/services/all/MapServer/%s/%s/htmlPopup?lang=%s" % (
            layer, id, lang)

        try:
            response, content = h.request(url)
            if response.status == 200:
                return content
        except httplib2.ServerNotFoundError:
            print "Site is Down"

    return None


def get_copyrights(filename='swissguesser/static/storymap9/data/copyright.csv'):
    copyrights = {}
    try:
        f = open(filename, 'rb')
        csv_file = csv.DictReader(f, delimiter=',', quotechar='"')

        for row in csv_file:
            # kgs nr p. ex. kgs_00005_0001
            kgs_nr = "kgs_{0:05d}_{1:04d}".format(
                int(row['NUMMER']), int(row['BILDNR']))
            copyrights[kgs_nr] = (row['COPYRIGHT'], row['FOTOGRAF'])

        return copyrights

    finally:
        f.close()


def extract_table(content, rows=None):

    dammit = UnicodeDammit(content, ["utf-8", "latin-1", "iso-8859-1"])
    soup = BeautifulSoup(dammit.unicode_markup)

    table = soup.find("table")
    # removing coordinates
    table.tr.find_next_sibling("tr").extract()
    table.tr.find_next_sibling("tr").extract()

    trs = table.tr.find_next_siblings("tr")

    more = trs[2].td.find_next_sibling("td")
    link = trs[3].td.find_next_sibling("td")

    trs[2].td.extract()
    trs[3].td.extract()

    trs[0].append(more)
    trs[1].append(link)

    if rows:
        new_tag = soup.new_tag("tr")
        new_tag.string = " — ".join(rows)
        trs[3].insert_after(new_tag)

    s = unicode(table)  # .decode('utf-8')

    return u''.join('&%s;' % entities[ord(c)] if ord(c) in entities else c for c in s)


if __name__ == '__main__':

    f = open(sys.argv[1], 'r')  # opens the csv file
    test_file = open('test2.csv', 'w')

    copyrights = get_copyrights()

    try:
        csv_file = csv.DictReader(f, delimiter=',', quotechar='"')

        csvwriter = csv.DictWriter(
            test_file, delimiter=',', fieldnames=csv_file.fieldnames)
        csvwriter.writerow(dict((fn, fn) for fn in csv_file.fieldnames))
        n = 0

        for row in csv_file:   # iterates the rows of the file in orders
            n += 1
            bild_nr = row['Bildnummer']
            kgs_nr = bild_nr.split('_')[1]

            bild_copyright = None

            if bild_nr in copyrights.keys():
                bild_copyright = copyrights[bild_nr]

            print kgs_nr,

            for lang in ['de', 'fr', 'it', 'en']:
                print lang,
                ct = get_html(kgs_nr, lang=lang)
                fieldname = 'Legende %s **' % lang.upper()

                table = extract_table(ct)

                row[fieldname] = extract_table(ct, bild_copyright)

                # print row[fieldname]

                #row[fieldname] = "?".join([url, "lang=%s" % lang])

            csvwriter.writerow(
                {k: v if v is not None else v for k, v in row.items()})
            print

            csvwriter.writerow(row)
    finally:
        f.close()      # closing
        test_file.close()
