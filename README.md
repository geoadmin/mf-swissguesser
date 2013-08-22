SwissGuessr
===========
(Story Map 5)

# Release notes

This project is in a pre-alpha stage.

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

The metadata for this project is provided in the form of a spreadsheet.
Export this file to CSV then use the converter tool:

$ cd app/data
data$ npm install csvtojson
data$ node convertCSV.js

# Licensing

Please see LICENSE in the project root.
