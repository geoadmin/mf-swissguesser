var lang = 'DE';

var user = { score: 0	};

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

var guess = {

	collection: null, config: null, 
	currentIndex: 0,

	overlay: null, answer: null, 
	layers: [], active: false,

	domOverlay: $('#map-overlay'),
	domResults: $('#d-result'),
	domLocator: $('#d-locator'),
	domBtnNext: $('#btn-continue'),

	configure: function(json) {

		this.config = json.conf;
		this.collection = json.data;
		this.loader( this.collection[0] );
		$('#d-start').modal('show');

	},

	loader: function(metadata) {

		// Get image data
		var imgbox = $('#d-photobox');
		var imgsrc = 
			this.config.dataPrefix + metadata.id + 
			this.config.dataSuffix;

		// Populate components
		$('img',imgbox).attr('src', imgsrc);
		$('p', 	imgbox).html(metadata[lang]);
		$('h4', imgbox).html(metadata.id);

		// Start guesser
		$('.btn-primary').one('click', function() {
			guess.init(map, [metadata.y, metadata.x]);
		});
	
	},

	next: function() {

		if (++this.currentIndex == this.collection.length) 
		this.currentIndex = 0;
		this.loader( this.collection[this.currentIndex] );

	},

	init: function(olMap, coordinates) {

		// Save the correct answer
		this.answer = coordinates;
		
		this.clear();
		this.active = true;

		// Hide buttons when guessing
		$('.btn.overlay').addClass('hidden');

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
		var vectorFeatures = this.paint(
				this.currentIndex + 1, this.position, this.answer
			);
		var vectorGuess = new ol.layer.Vector({
			style: new ol.style.Style({ rules: this.rules }),
			source: new ol.source.Vector({
				projection: map.getView().getProjection(),
				parser: new ol.parser.GeoJSON(),
				data: {
					type: 'FeatureCollection',
					features: vectorFeatures
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
		this.next(); // continue the game

	}, // -- guess

	paint: function(label, from, to) {
		return [
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
	}, // -- paint

	rules: [
	  new ol.style.Rule({
	  	filter: 'geometryType("linestring")',
	    symbolizers: [
	      new ol.style.Line({
	        color: ol.expr.parse('color'),
	        width: 2,
	        opacity: 0.4
	      })
	    ]
	  }),
	  new ol.style.Rule({
	    filter: 'geometryType("point")',
	    symbolizers: [
	      new ol.style.Shape({
	        size: 40,
	        fillColor: '#aa0', 
	        fillOpacity: 0.8
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
	] // -- rules
};

// Load data and start game

$.getJSON('data/base.json', function(d) { guess.configure(d); });