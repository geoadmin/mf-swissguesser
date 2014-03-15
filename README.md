SwissGuesser
============

Swissguesser multi-projects

1/ Install 

   cd /var/www/vhosts/mf-swissguesser/private 

   git clone git@github.com:geoadmin/mf-swissguesser.git swissguesser

   python bootstrap.py --version 1.5.2 --distribute --download-base http://pypi.camptocamp.net/distribute-0.6.22_fix-issue-227/ --setup-source http://pypi.camptocamp.net/distribute-0.6.22_fix-issue-227/distribute_setup.py

   buildout/bin/buildout -c buildout.cfg

   sudo apache2ctl graceful

2/ Deploy

   cd /var/www/vhosts/mf-swissguesser/private/swissguesser

   sudo -u deploy deploy -r deploy/deploy.cfg int   # or prod
