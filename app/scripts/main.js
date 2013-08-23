var lang = 'DE';

var user = {
			score: 0
		};

/* Setup UI components */

$('.modal.fade').on('shown.bs.modal', function () {
	$('#btn-start').fadeOut();
}).on('hidden.bs.modal', function () {
	$('#btn-start').fadeIn('slow');

	if (guess.active) {
		guess.start();
	}
});

/* Disabled: buggy in Chrome
$('.d-photo').click(function() {
	if ($(this).hasClass('fullscreen')) {
		$(this).removeClass('fullscreen');
	} else {
		$(this).addClass('fullscreen');
	} });
*/

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
	$('.btn-primary').one('click', function() {
		$('.btn.overlay').addClass('hidden');
		
		// Set up guesser component
		guess.init(map, [metadata.y, metadata.x]);
	});
}

function nextImage() {
	if (++currentIndex == collection.length) 
		currentIndex = 0;
	loadImage( collection[currentIndex] );
}

var guess = {

	overlay: null, answer: null, 
	layers: [], active: false,

	domOverlay: $('#map-overlay'),
	domResults: $('#d-result'),
	domLocator: $('#d-locator'),
	domBtnNext: $('#btn-continue'),

	init: function(olMap, coordinates) {

		// Save the correct answer
		this.answer = coordinates;
		
		this.clear();
		this.active = true;

		// On re-init, clear map
		if (this.overlay != null) {
			return;
		}

		// Get current template
		this.html = this.domOverlay.html();
		this.domOverlay.html(''); // and clear

		// Create an Overlay
		this.overlay =
			new ol.Overlay({
				map: olMap, element: this.domOverlay[0]
			});

		// Bind click event to map
		var self = this;
		olMap.on('click', function(evt) { self.place(evt); });

	}, // -- init

	start: function() {

		guess.domLocator.removeClass('hidden');

	},

	clear: function() {

			$.each(this.layers, function() {
				map.removeLayer(this);
			});
			this.layers = [];
			this.domResults.addClass('hidden');
			this.active = false;

	}, // -- clear

	place: function(evt) {
		var self = this;
		if (!self.active) return;

		// Update placement
		this.position = evt.getCoordinate();
		this.overlay.setPosition(this.position);
		//console.log(this.position);

		// Show the overlay
		this.domOverlay
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
		
		this.active = false;
		console.log('Making a guess: ', this.position, this.answer);

		/* Create overlay vector */
		var vectorGuess = new ol.layer.Vector({
			style: new ol.style.Style({ rules: this.rules() }),
			source: new ol.source.Vector({
				projection: map.getView().getProjection(),
				parser: new ol.parser.GeoJSON(),
				data: {
					type: 'FeatureCollection',
					features: this.paint(currentIndex + 1, this.position, this.answer)
				}
			})
		}); // -- ol.layer.Vector

		this.layers.push(map.addLayer(vectorGuess));

		/* Calculate score */
		var dist = 
			Math.sqrt(
				Math.pow(Math.abs(this.position[0] - this.answer[0]), 2) +
				Math.pow(Math.abs(this.position[1] - this.answer[1]), 2));

		var score = parseInt(Math.abs(180000-dist)/10000)*100;
		user.score += score;

		this.domOverlay.popover('hide');
		this.domLocator.addClass('hidden');

		this.domResults.find('.score').html(score);
		this.domResults.find('.total').html(user.score);
		this.domResults.find('.comment').html('Well done!');
		this.domResults.removeClass('hidden');

		this.domBtnNext.removeClass('hidden');
		nextImage(); // continue the game

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
			        strokeOpacity: 0.4
			      })
			    ]
			  }),
			  new ol.style.Rule({
			    filter: 'geometryType("point")',
			    symbolizers: [
			      new ol.style.Shape({
			        size: 40,
			        fillColor: '#aa0',
			        fillOpacity: 0.8,
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
			        fillColor: '#0e0',
			        fillOpacity: 0.8,
			        strokeOpacity: 1
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