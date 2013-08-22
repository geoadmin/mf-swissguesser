var defaultConfig = {
	outFileName: 	"data/base.json", 
	csvFileName: 	'data/MetadatenAufnahmen.csv',
	dataPrefix: 	"data/photos",
	dataSuffix: 	"_A1.jpg"
}
var config = {
	outFileName:  process.argv[2],
	csvFileName:  process.argv[3],
	dataPrefix: 	process.argv[4],
	dataSuffix: 	process.argv[5]
}

// Just use the defaults..
config = defaultConfig;

var hasArguments = true;
Object.keys(config).forEach(function(key) {
	if (config[key] === undefined) {
		hasArguments = false;
		console.log("Please provide " + key + ", e.g.: " + defaultConfig[key]);
	}
});

if (!hasArguments) return;

/* Check for trailing slash */
if (config.dataPrefix.indexOf(-1) != '/') config.dataPrefix += '/';

/* Load converter dependencies */
var Converter = require("csvtojson").core.Converter;
var fs = require('fs');

/* Parse and convert data file */
var csvData = [];
var csvConverter = new Converter();
csvConverter.on("end_parsed",function(jsonObj){
	jsonObj.csvRows.forEach(function(item) {
    var data = {
    	id: 	item['Bildname'],
    	x: 		parseFloat(item['Koordinate X']),
    	y: 		parseFloat(item['Koordinate  Y']),
    	DE: 	item['Beschreibung DE'],
    	FR: 	item['Beschreibung FR'],
    	IT: 	item['Beschreibung IT'],
    	EN: 	item['Beschreibung EN']
    };
    var filename = config.dataPrefix + data.id + config.dataSuffix;
    fs.exists(filename, function(exists) {
    	if (!exists)
    		console.log("[ERROR] File not found: " + filename);
    });
    //console.log(data);
    csvData.push(data);
	});
	//console.log(csvData);

	/* Write to output file */
	fs.writeFile(config.outFileName, JSON.stringify({data: csvData, conf: config}), 
		function (err) {
			if (err) throw err;
			console.log("Saved to " + config.outFileName);
		});
});

/* Start conversion process */
console.log("Converting " + config.csvFileName);
csvConverter.from(config.csvFileName);