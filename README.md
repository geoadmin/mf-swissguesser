SwissGuessr (Story Map 5)
=========================

UNDER DEVELOPMENT

## Dependencies

The website is built with Twitter's Bootstrap 2 framework.

### Installation instructions

1. Setup Node.js http://nodejs.org/download/
2. Install Yeoman from NPM

$ npm install -g yo

(This will install Grunt and Bower automatically)

## Compiling resources

 

## Converting data

The metadata for this project is provided in the form of an XSLX file. 
Convert this file to CSV then use a tool like this one (Node.js) to convert to JSON.

$ sudo npm install -g csvtojson

$ csvtojson MetadatenAufnahmen.csv > data/photos.json

Please see LICENSE in the project root.
