#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Usage: lubis_preprocessing.py  <template.csv>

This scripts try to convert the infos from the input CSV:

    OBJECTID,UUID,EBKEY,IMAGE_NUMB,X,Y,Z,ACQUISITIO,FILENAME

to the standard column of the 'MetadatenAufnahmen.csv':

   Bildnummer,Y Koordinate,X Koordinate,Bildbeschreibung *,Legende DE **,Legende FR **,Legende IT **,Legende EN **,Map.geo.admin.ch link,Kommentar,X


It additionnaly renames the images files with their EBKEY name

"""


import os
import sys
import csv

import os.path
import subprocess
import shutil



FIELDNAMES = [
    'Bildnummer', 'Y Koordinate', 'X Koordinate', 'Bildbeschreibung *', 'Legende DE **',
    'Legende FR **', 'Legende IT **', 'Legende EN **', 'Map.geo.admin.ch link', 'Kommentar', 'X']


BASE_IMAGE_DIR = os.path.abspath(
    'swissguesser/static/storymap10/data/photos')

output_file_name = 'MetadatenAufnahmen.csv.template'

if __name__ == '__main__':

    if len(sys.argv) <> 2:
        print __doc__
        sys.exit(1)

    input_file_name = sys.argv[1]

    image_dir = 'Quickviews_' + os.path.basename(input_file_name).split('.')[:-1][0]

    print "Will save to", output_file_name

    f = open(input_file_name, 'r')

    out_file = open(output_file_name, 'w')
    try:
        csv_file = csv.DictReader(f, delimiter=',', quotechar='"')

        csvwriter = csv.DictWriter(
            out_file, delimiter=',', fieldnames=FIELDNAMES)
        csvwriter.writerow(dict((fn, fn) for fn in FIELDNAMES))
        n = 0

        for row in csv_file:
                n += 1
                nr = int(row['EBKEY'])
                fname = row['FILENAME']
                base, ext = os.path.splitext(fname.split('\\')[-1])

                out_row = dict(zip(FIELDNAMES, [''] * len(FIELDNAMES)))

                out_row['Bildnummer'] = nr
                out_row['Y Koordinate'] = int(row['X'])
                out_row['X Koordinate'] = int(row['Y'])
                out_row['Bildbeschreibung *'] = row['ACQUISITIO']
                out_row['Kommentar'] = row['FILENAME']

                ori = os.path.join(BASE_IMAGE_DIR, image_dir, base + '.jpg')
                dest = os.path.join(BASE_IMAGE_DIR, str(nr) + '.jpg')
                print ori
                if os.path.exists(ori) and not os.path.exists(dest):
                    print "Found %s" % ori

                    print "Copying to %s " % dest

                    shutil.copy2(ori, dest)


                csvwriter.writerow(out_row)
    finally:
        f.close()      # closing
        out_file.close()
