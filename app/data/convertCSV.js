var Converter = require("csvtojson").core.Converter;
var fs = require('fs');

var config = {
	csvFileName:  process.argv[2],
	dataPrefix: 	process.argv[3],
	dataSuffix: 	process.argv[4]
}
var defaultConfig = {
	csvFileName: 	'MetadatenAufnahmen.csv',
	dataPrefix: 	"photos",
	dataSuffix: 	"_A1.jpg"
}

config = defaultConfig;

var hasArguments = true;
Object.keys(config).forEach(function(key) {
	if (config[key] === undefined) {
		hasArguments = false;
		console.log("Please provide " + key + ", e.g.: " + defaultConfig[key]);
	}
});

if (!hasArguments) return;

if (config.dataPrefix.indexOf(-1) != '/') config.dataPrefix += '/';

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
    console.log(data);
    var filename = config.dataPrefix + data.id + config.dataSuffix;
    fs.exists(filename, function(exists) {
    	if (!exists)
    		console.log("[ERROR] File not found: " + filename);
    });
	});
});

console.log("Converting " + config.csvFileName);
csvConverter.from(config.csvFileName);