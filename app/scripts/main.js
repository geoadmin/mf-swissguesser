var lang = 'DE';

/* Setup UI components */

$('.modal.fade').on('shown.bs.modal', function () {
	$('#btn-start').fadeOut();
}).on('hidden.bs.modal', function () {
	$('#btn-start').fadeIn('slow');
});

$('.d-photo').click(function() {
	if ($(this).hasClass('fullscreen')) {
		$(this).removeClass('fullscreen');
	} else {
		$(this).addClass('fullscreen');
	} });

/* Load image data */

var collection, config, currentIndex = 0;

$.getJSON('data/base.json', function(json) {
	config = json.conf;
	collection = json.data;
	loadImage( collection[0] );
});

function loadImage(metadata) {
	var imgbox = $('#d-photobox');
	var imgsrc = 
		config.dataPrefix + 
		metadata.id + 
		config.dataSuffix;
	$('img',imgbox).attr('src', imgsrc);
	$('p', 	imgbox).html(metadata[lang]);
	$('h4', imgbox).html(metadata.id);
}

function nextImage() {
	if (++currentIndex == collection.length) 
		currentIndex = 0;
	loadImage( collection[currentIndex] );
}

$('#btn-guess').click(function() {

});

var guess = {

	answer: null,

	init: function(olMap, elementId, coordinates) {

		// Get current template
		this.dom = $('#' + elementId);
		this.html = this.dom.html();
		this.dom.html(''); // and clear

		// Create an Overlay
		this.overlay =
			new ol.Overlay({
				map: olMap, element: this.dom[0]
			});

		// Save the correct answer
		this.answer = coordinates;

	}, // -- init

	place: function(evt) {
		var self = this;

		// Update placement
		this.position = evt.getCoordinate();
		this.overlay.setPosition(this.position);
		//console.log(this.position);

		// Show the overlay
		this.dom
			.removeClass('hidden')
			.popover({ 
				'placement': 'top', 'html': true, 
				'content': this.html })
			.popover('show');

		// Make a guess
		$('#btn-guess').click(function(evt) {
			evt.preventDefault(); 
			self.guess();
		});

	}, // -- place

	guess: function() {
		
		console.log('Making a guess: ', this.position, this.answer);

		var style = new ol.style.Style({ rules: this.rules() });

		var vectorGuess = new ol.layer.Vector({
			style: style,
			source: new ol.source.Vector({
				projection: map.getView().getProjection(),
				parser: new ol.parser.GeoJSON(),
				data: {
					type: 'FeatureCollection',
					features: this.paint(currentIndex + 1, this.position, this.answer)
				}
			})
		}); // -- ol.layer.Vector

		map.addLayer(vectorGuess);

	}, // -- guess

	paint: function(label, from, to) {
		var geoJSON = 
			[
				{
					type: 'Feature',
					properties: { color: '#fff' },
					geometry: {
						type: 'LineString', coordinates: [from, to] }
				},{
					type: 'Feature',
					properties: { 
						label: label },
					geometry: {
						type: 'Point', coordinates: from }
				},{
					type: 'Feature',
					properties: {
						label: label, which: 'answer' },
					geometry: {
						type: 'Point', coordinates: to }
				}
			];
		return geoJSON;
	}, // -- paint

	rules: function() {
		var ruleSet = 
			[
			  new ol.style.Rule({
			  	filter: 'geometryType("linestring")',
			    symbolizers: [
			      new ol.style.Line({
			        strokeColor: ol.expr.parse('color'),
			        strokeWidth: 2,
			        strokeOpacity: 0.2
			      })
			    ]
			  }),
			  new ol.style.Rule({
			    filter: 'geometryType("point")',
			    symbolizers: [
			      new ol.style.Shape({
			        size: 40,
			        fillColor: '#511',
			        fillOpacity: 0.6,
			        strokeOpacity: 1
			      }),
			      new ol.style.Text({
			        color: '#bada55',
			        text: ol.expr.parse('label'),
			        fontFamily: 'Calibri,sans-serif',
			        fontSize: 14
			      })
			    ]
			  }),
			  new ol.style.Rule({
			    filter: 'geometryType("point") && which == "answer"',
			    symbolizers: [
			      new ol.style.Shape({
			        size: 40,
			        fillColor: '#0e0'
			      }),
			      new ol.style.Text({
			        color: '#bada55',
			        text: ol.expr.parse('label'),
			        fontFamily: 'Calibri,sans-serif',
			        fontSize: 14
			      })
			    ]
			  })
			];
		return ruleSet;
	} // -- rules
};

$(window).load(function() {

	// Set up guesser component
	guess.init(map, 'map-overlay', [637750, 193875]);
	map.on('click', function(evt) { guess.place(evt); });
	
});