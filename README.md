SwissGuessr
===========
(Story Map 5)

UNDER DEVELOPMENT

# Documentation

## Dependencies

The website is built with the Twitter Bootstrap 2 framework.

### Installation instructions

1. Setup Node.js http://nodejs.org/download/
2. Install Yeoman from NPM

$ npm install -g yo

This will install Grunt and Bower automatically.

## Compiling resources

To a local server watching for changes, and open a browser:

storymap5$ grunt server

See Grunt documentation for other commands.

## Converting data

The metadata for this project is provided in the form of an XSLX file. 

Convert this file to CSV then use a tool like this one (Node.js) to convert to JSON.

$ sudo npm install -g csvtojson

data$ csvtojson MetadatenAufnahmen.csv > data/photos.json

# Licensing

Please see LICENSE in the project root.
