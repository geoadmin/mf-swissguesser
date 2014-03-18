SwissGuesser
============

Swissguesser multi-projects

1/ Install 

    cd /var/www/vhosts/mf-swissguesser/private

    git clone git@github.com:geoadmin/mf-swissguesser.git swissguesser

    python bootstrap.py --version 1.5.2 --distribute --download-base http://pypi.camptocamp.net/distribute-0.6.22_fix-issue-227/ --setup-source http://pypi.camptocamp.net/distribute-0.6.22_fix-issue-227/distribute_setup.py

    buildout/bin/buildout -c <project buildout>.cfg

    sudo apache2ctl graceful

2/ Deploy

    cd /var/www/vhosts/mf-swissguesser/private/swissguesser

    sudo -u deploy deploy -r deploy/deploy.cfg int   # or prod



## Subproject specific

Each subproject has two main .csv configurations files:
* `MetadatenAufnahme.csv` and
* `translation.csv

These two files are used to generate various json files, respectively with `buildout install convert-csv`and `buildout install translate-csv`.

In `MetadatenAufnahme.csv`, the `Legend` columns may contain plain text, html entities or link to an external file. Using the `convert-csv`buildout part,
if you provide a `downloadUrl`on as an argument, the images will be linked instead of beeing downloaded.

### Storymap5 (BAR)

The original one!. This GeoAdmin Story Map is an interactive game to guess historical locations from the Swiss National Archive on a Swisstopo map of Switzerland.

### Storymap9 (KGS)




### Storymap10 (LUBIS)

Historic aerial view