var basePath = 'swissguesser/static/'
var defaultConfig = {
    outFileName: 'data/base.json',
    csvFileName: 'data/MetadatenAufnahmen.csv',
    dataPrefix: 'data/photos/',
    dataSuffix: '_A1.jpg'
}
var downloadUrl = null;
if (process.argv[7] && (process.argv[7].indexOf('http') == 0 )) {  downloadUrl = process.argv[7];};
var config = {
    outFileName: process.argv[2],
    csvFileName: process.argv[3],
    dataPrefix: process.argv[4],
    dataSuffix: process.argv[5],
    project: process.argv[6],
    downloadUrl: downloadUrl,
    downloadImages: false
}

// Just use the defaults..
//config = defaultConfig;

var hasArguments = true;
Object.keys(config).forEach(function (key) {
    if (config[key] === undefined) {
        hasArguments = false;
        console.log("Please provide " + key + ", e.g.: " + defaultConfig[key]);
    }
});

if (!hasArguments) return;

console.log(config);

/* Load converter dependencies */
var Converter = require('csvtojson').core.Converter;
var http = require('http');
var fs = require('fs');
var path = require('path');
var async = require('async');


var count = 0;

var download = function (task, cb) {
    console.log('Downloading from ' + task.url);
    var file = fs.createWriteStream(task.dest);
    var request = http.get(task.url, function (response) {
        response.pipe(file);
        file.on('finish', function () {
            file.close();
            cb('Saved file to ' + task.dest);
        });
    });
    request.on('error', function (e) {
        console.log("Got error: " + e.message);
    });
}

var queue = async.queue(download, 10); // Run ten simultaneous uploads


queue.drain = function() {
    console.log("All missing files have bee downloaded");
};


/* Parse and convert data file */
var csvData = [];
var csvConverter = new Converter();
csvConverter.on("end_parsed", function (jsonObj) {
    var url;
    jsonObj.csvRows.forEach(function (item) {
        var data = {
            id: item['Bildnummer'],
            x: parseFloat(item['X Koordinate']),
            y: parseFloat(item['Y Koordinate']),
            DE: item['Legende DE **'],
            FR: item['Legende FR **'],
            IT: item['Legende IT **'],
            EN: item['Legende EN **']
        };
        if (data.id.length < 4) return;
        var filename = config.dataPrefix + data.id + config.dataSuffix;
        fs.exists(basePath + filename, function (exists) {

           //if(fs.existsSync(basePath + filename)) {
            if (!exists) {
                if (config.downloadImages) {
                    count += 1;
                    var remote_filename = data.id + config.dataSuffix;

                    url = config.downloadUrl + remote_filename;
                    //data.imageUrl = url;

                    queue.push({url: url, dest: basePath + filename}, function (msg) {
                          console.log(msg);
                    });
                } else {
                    console.log("[ERROR] File not found: " + basePath + filename);
                }
            };
         });
        //console.log(data);
        csvData.push(data);
    });
    //console.log(csvData);

    // image dir is relative to html page
    config.dataPrefix = path.relative(path.resolve(basePath + config.project), path.resolve(basePath + config.dataPrefix)) + '/';

    /* Write to output file */
    fs.writeFile(basePath + config.outFileName,
        JSON.stringify({
            data: csvData,
            conf: config
        }),
        function (err) {
            if (err) throw err;
            console.log("Saved to " + basePath + config.outFileName);
        });

});

/* Start conversion process */
console.log("Converting " + basePath + config.csvFileName);
csvConverter.from(basePath + config.csvFileName);
