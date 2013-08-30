SwissGuessr
===========

(Story Map 5)

# Release notes

This project is in a pre-alpha stage.

# Documentation

See [main](app/scripts/main.html) and [wms-custom-proj](app/scripts/wms-custom-proj.html).

## Dependencies

The website is built with the Twitter Bootstrap 3 framework.

### Installation instructions

1. Install Node.js http://nodejs.org/download/
2. Install dependencies NPM

$ npm install

This will install Grunt and Bower automatically.

## Compiling resources

To a local server watching for changes, and open a browser:

storymap5$ grunt server

See Grunt documentation for other commands.

## Converting data

The metadata for this project is provided in the form of a spreadsheet.
Export this file to CSV then use the converter tool:

$ node convertCSV.js

# Licensing

Please see LICENSE in the project root.
