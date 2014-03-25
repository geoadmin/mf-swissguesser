#!/usr/bin/env python

import os
import sys
import csv
import httplib2
from bs4 import BeautifulSoup

from htmlentitydefs import codepoint2name as entities


layers = ['ch.swisstopo.lubis-luftbilder_farbe',
          'ch.swisstopo.lubis-luftbilder_schwarzweiss', 'ch.swisstopo.lubis-luftbilder-dritte-firmen']

SERVICE_BASE_URL = "http://mf-chsdi3.int.bgdi.ch"

# Link to the htmlPopup or scrap it content to the file ?
LINK_TO_INFO = True

# url =
# http://mf-chsdi3.int.bgdi.ch/main/wsgi/rest/services/all/MapServer/ch.swisstopo.lubis-luftbilder_farbe/19982271021945/extendedHtmlPopup

# Given an id return the layer id to which it belongs...
def guess_layername(id):
    h = httplib2.Http(".cache")

    for layer in layers:
        url = SERVICE_BASE_URL + "/main/wsgi/rest/services/all/MapServer/%s/%d/htmlPopup" % (
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
        url = SERVICE_BASE_URL + "main/wsgi/rest/services/all/MapServer/%s/%d/extendedHtmlPopup?lang=%s" % (
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

    input_file_name = sys.argv[1]

    output_file_name = ('.').join(input_file_name.split('.')[:-1])

    print "Will save to", output_file_name

    f = open(input_file_name, 'r')  
  
    test_file = open(output_file_name, 'w')
    try:
        csv_file = csv.DictReader(f, delimiter=',', quotechar='"')

        csvwriter = csv.DictWriter(
            test_file, delimiter=',', fieldnames=csv_file.fieldnames)
        csvwriter.writerow(dict((fn, fn) for fn in csv_file.fieldnames))
        n = 0

        for row in csv_file:  
            n += 1
            nr = int(row['Bildnummer'])
            print nr,
            url = guess_layername(nr)

            for lang in ['de', 'fr', 'it', 'en']:
                print lang,
                
                fieldname = 'Legende %s **' % lang.upper()

                if LINK_TO_INFO:
                    row[fieldname] = "?".join([url, "lang=%s" % lang])
                else:
                    ct = get_html(nr,lang=lang)
                    row[fieldname] = extract_table(ct)

            # print row.encode('utf-8')
            csvwriter.writerow(
                {k: v.encode('utf8') if v is not None else v for k, v in row.items()})
            print

            csvwriter.writerow(row)
    finally:
        f.close()      # closing
        test_file.close()
