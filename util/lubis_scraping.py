#!/usr/bin/env python

import os
import sys
import csv
import httplib2
from bs4 import BeautifulSoup

from htmlentitydefs import codepoint2name as entities


layers = ['ch.swisstopo.lubis-luftbilder_farbe',
          'ch.swisstopo.lubis-luftbilder_schwarzweiss', 'ch.swisstopo.lubis-luftbilder-dritte-firmen']

# url =
# http://mf-chsdi3.int.bgdi.ch/main/wsgi/rest/services/all/MapServer/ch.swisstopo.lubis-luftbilder_farbe/19982271021945/extendedHtmlPopup


def guess_layername(id):
    h = httplib2.Http(".cache")

    for layer in layers:
        url = "http://mf-chsdi3.int.bgdi.ch/main/wsgi/rest/services/all/MapServer/%s/%d/htmlPopup" % (
            layer, id)
        try:
            response, content = h.request(url)
            if response.status == 200:
                return url
        except httplib2.ServerNotFoundError:
            print "Site is Down"

    return None


def get_html(id, lang='de'):
    h = httplib2.Http(".cache")

    for layer in layers:
        url = "http://mf-chsdi3.int.bgdi.ch/main/wsgi/rest/services/all/MapServer/%s/%d/extendedHtmlPopup?lang=%s" % (
            layer, id, lang)

        try:
            response, content = h.request(url)
            if response.status == 200:
                return content
        except httplib2.ServerNotFoundError:
            print "Site is Down"

    return None


def extract_table(content):
    soup = BeautifulSoup(content)

    table = soup.find(
        "table", {"class": ["table-with-border", "kernkraftwerke-extended"]})

    s = unicode(table)  # .decode('utf-8')

    return u''.join('&%s;' % entities[ord(c)] if ord(c) in entities else c for c in s)


if __name__ == '__main__':

    f = open(sys.argv[1], 'r')  # opens the csv file
    test_file = open('test2.csv', 'w')
    try:
        csv_file = csv.DictReader(f, delimiter=',', quotechar='"')

        csvwriter = csv.DictWriter(
            test_file, delimiter=',', fieldnames=csv_file.fieldnames)
        csvwriter.writerow(dict((fn, fn) for fn in csv_file.fieldnames))
        n = 0

        for row in csv_file:   # iterates the rows of the file in orders
            n += 1
            nr = int(row['Bildnummer'])
            print nr,
            url = guess_layername(nr)

            for lang in ['de', 'fr', 'it', 'en']:
                print lang,
                #ct = get_html(nr,lang=lang)
                fieldname = 'Legende %s **' % lang.upper()
                #row[fieldname] = extract_table(ct)

                row[fieldname] = "?".join([url, "lang=%s" % lang])

            # print row.encode('utf-8')
            csvwriter.writerow(
                {k: v.encode('utf8') if v is not None else v for k, v in row.items()})
            print

            # csvwriter.writerow(row)
    finally:
        f.close()      # closing
        test_file.close()
