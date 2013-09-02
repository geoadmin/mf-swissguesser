SwissGuesser
============

This GeoAdmin project (Story Map 5) is an interactive game to guess historical locations around Switzerland on the Swisstopo map.

# Release notes

This project is in alpha stage.

# Dependencies

The project is built with OpenLayers 3, jQuery 2 and the Twitter Bootstrap 3 framework, with a collection of tools powered by Node.js.

# Installation

1. Install Node.js http://nodejs.org/download/
2. Install dependencies from the Node Package Manager with this command at the project root:

storymap5$ npm install

This will install Grunt and Bower automatically.

## Preparing data

The metadata for this project is provided in the form of a spreadsheet. Export this file to CSV then use the converter tool:

storymap5$ node convertCSV.js

Due to licensing restrictions, the photo archive JPEGs must be copied manually to the `/app/data/photos/` folder. Their filenames will correspond to the images defined in `base.json`, e.g. `14093_0799_A1.jpg`.

## Compiling resources

To a local server watching for changes, and open a browser:

storymap5$ grunt server

To create a `docs/` folder with HTML documentation, run:

storymap5$ grunt docs

See Grunt documentation and `Gruntfile.js` for other commands.

## Deploying releases

First you need to build the Bootstrap framework. From the `app/bower_components/bootstrap/` folder run:

bootstrap$ npm install

bootstrap$ grunt dist

Now you can build this project's distribution folder.

storymap5$ grunt build

Note: as in [Preparing data](#Preparing data), above, you need to copy photos manually to the `/data/photos/` folder:

storymap5$ cp -r app/data/photos dist/data/

Afterwards, zip up the dist folder and deploy it to the target host.

# Technical documentation

See [guesser](app/scripts/guesser.html) and [wms-custom-proj](app/scripts/wms-custom-proj.html).

# Licensing

Please see `LICENSE` in the project root.
