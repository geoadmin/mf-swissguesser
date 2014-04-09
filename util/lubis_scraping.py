#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Usage: lubis_scrapper.py <MetadatenAufnahme template>\nkgs_scrapper.py swissguesser/static/storymap9/data/MetadatenAufnahmen.csv.template

This script convert a file <MetadatenAufnahme template> into a usable <MetadatenAufnahme> file. The <MetadatenAufnahme template> contains
only images number and their coordinates, while the geerated file has the 'legend' field infos filled.

For LUBIS, the legend are simply link to map.geo.admin.ch popup, ie.

http://api3.geo.admin.ch/main/wsgi/rest/services/all/MapServer/ch.swisstopo.lubis-luftbilder_farbe/19982271021945/extendedHtmlPopup


"""


import os
import sys
import csv
import httplib2
from bs4 import BeautifulSoup

from htmlentitydefs import codepoint2name as entities


layers = ['ch.swisstopo.lubis-luftbilder_farbe',
          'ch.swisstopo.lubis-luftbilder_schwarzweiss', 'ch.swisstopo.lubis-luftbilder-dritte-firmen']

SERVICE_BASE_URL = "http://api3.geo.admin.ch"

# Link to the htmlPopup or scrap it content to the file ?
LINK_TO_INFO = True



def guess_layername(id):
    '''
        Given an id return the layer id to which it belongs...
    '''
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
    '''
        Get the html content of a popup
    '''
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
    '''
        Extract a table form the whole html popup
    '''
    soup = BeautifulSoup(content)

    table = soup.find(
        "table", {"class": ["table-with-border", "kernkraftwerke-extended"]})

    s = unicode(table)  # .decode('utf-8')

    return u''.join('&%s;' % entities[ord(c)] if ord(c) in entities else c for c in s)


if __name__ == '__main__':

    if len(sys.argv) <>  2:
        print __doc__
        sys.exit(2)

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


            csvwriter.writerow(
                {k: v.encode('utf8') if v is not None else v for k, v in row.items()})
            print

            csvwriter.writerow(row)
    finally:
        f.close()     
        test_file.close()
