// # SwissGuesser
// 
// (Story Map 5)
// 
// A game to look for historical pictures on a map.

// Main closure
var guesser = {

	// Default language is German
	lang: 'DE',

	// Set up anonymous user profile
	user: { score: 0	},

	// State variables
	config: null, 
	overlay: null, 
	collection: null, 
	currentIndex: 0,
	currentAnswer: null, 
	active: false,
	layers: [], 

	// DOM references
	domOverlay: 	$('#map-overlay'),
	domResults: 	$('#d-result'),
	domLocator: 	$('#d-locator'),
	domBtnNext: 	$('#btn-continue'),
	domBtnStart: 	$('#btn-start'), 
	domStartBox: 	$('#d-start'),
	domPhotoBox: 	$('#d-photobox'), 
	domLightBox: 	$('#d-lightbox'), 

	// ### Initial setup
	configure: function(json) {

		var self = this;
		self.config = json.conf;
		self.collection = json.data;

		// Fullscreen
		$('.lightbox').on('shown.bs.modal', function () {
			$('.modal-backdrop.in').css('opacity', 1);
		}).on('hidden.bs.modal', function () {
			// Clear backdrops properly (bug?)
			$('.modal-backdrop.in').remove();
		});

		// Start the game (open dialog)
		//this.domStartBox.modal('show');
		self.resize();
		$(window).on('resize', function() { self.resize(); });

		// Load the map
		initGeoAdmin();

		// Bind challenge start
		self.domBtnStart.click(function() {
			self.loader( self.collection[0] );
		});

		// Bind switcher buttons
		$('.mobile-switch button').click(function() {
			var tgt = $($(this).attr('data-target'));
			$('.container-main > div.on').removeClass('on');
			tgt.addClass('on');
			$(this).parent().find('.active').removeClass('active');
			$(this).addClass('active');
		});
		$('.container-main > div.on:last').removeClass('on');

	},

	// ### Position the map container
	resize: function() {
		var frameheight = $(window).height() - 92;
		$('.container-main').css('height', frameheight + 'px');
		$('.d-photo').css('height', (frameheight - 90) + 'px');
		//$('#map').css('width', parseInt($(window).width()/2) + 'px');
		if (map) map.updateSize();
	},

	// ### Load image data
	loader: function(metadata) {

		// Get image data
		var imgbox = this.domPhotoBox,
				imgsrc = 
					this.config.dataPrefix + metadata.id + 
					this.config.dataSuffix;

		// Load images
		$('.d-photo').css('background-image', 'url(' + imgsrc + ')');
		$('img', this.domLightBox).attr('src', imgsrc);

		// Populate components
		$('h4', imgbox).attr('title', metadata.id);
		$('.image-count', imgbox).html(this.currentIndex+1);
		$('.image-total', imgbox).html(this.collection.length);
	
		// Start the challenge
		guesser.challenge(map, [metadata.y, metadata.x]);

	},

	// ### Continue to next image
	next: function() {

		if (++this.currentIndex == this.collection.length) {
			return this.finish();
		}

		// Continue to next image
		this.loader( this.collection[this.currentIndex] );

		// On mobile, switch tabs
		$('.mobile-switch button:first').click();

	},

	// ### Game over
	finish: function() {

		var msg = "I just scored " + this.user.score + " on #SwissGuesser! Beat that :)";

		var sharebox = $('.sharebox');

		$('.btn-email', sharebox).click(function() {
				location.href = 
					'mailto:?subject=' 
					+ msg + '&body=' + document.location.href;
			});
		
		$('.btn-twitter', sharebox).click(function() {
				location.href =  
			'https://twitter.com/intent/tweet?button_hashtag=SwissGuesser&text='
				+ msg;
			//https://twitter.com/intent/tweet?hashtags=SwissGuesser%2C&original_referer=http%3A%2F%2Fxublet%2Fgeo%2Fweb-storymaps%2Fstorymap5%2Fapp%2F&related=swiss_geoportal&text=I%20just%20scored%202300%20on%20%23SwissGuesser!%20Beat%20that%20%3A%29&tw_p=tweetbutton&url=http%3A%2F%2Fstorymaps.geo.admin.ch%2Fstorymaps%2Fstorymap5
			});

		$('#btn-continue').hide();
		$('#v-finish').removeClass('hidden');

		//this.currentIndex = -1;
		//this.next();

	},

	// ### User starts making a guess 
	challenge: function(olMap, coordinates) {

		// Save the correct answer
		this.currentAnswer = coordinates;
		
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
		olMap.on('click', function(evt) { guesser.place(evt); });

	}, // -- challenge

	// ### Clear map of answers
	clear: function() {

			$.each(this.layers, function() {
				map.removeLayer(this);
			});
			this.layers = [];
			this.domResults.addClass('hidden');
			this.active = false;

	}, // -- clear

	// ### Place an answer
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

		// Link button action
		// NB: this button gets recreated for each overlay
		$('#btn-guess').click(function(evt) {
			evt.preventDefault(); 
			guesser.guess();
			return false;
		});

	}, // -- place

	// ### Submit a guess
	guess: function() {
		
		// Deactivate guessing for this round
		this.active = false;
		//console.log('Making a guess: ', this.position, this.currentAnswer);

		// Sets up a new vector layer
		var vectorGuess = this.getVector(
			this.currentIndex + 1, this.position, this.currentAnswer);

		// Add layer to the map
		map.addLayer(vectorGuess);

		// Calculate distance to answer
		var dist = 
			Math.sqrt(
				Math.pow(Math.abs(this.position[0] - this.currentAnswer[0]), 2) +
				Math.pow(Math.abs(this.position[1] - this.currentAnswer[1]), 2));

		// Calculate score
		var score = parseInt(Math.abs(180000-dist)/10000)*100;
		this.user.score += score;

		// Hide the overlays
		this.domOverlay.popover('hide');
		this.domLocator.addClass('hidden');

		// Update dialog with score results
		this.domResults.find('.score').html(score);
		this.domResults.find('.total').html(this.user.score);
		this.domResults.find('.comment').html('Well done!');

		// Show dialog and get ready to continue the game
		this.domResults.removeClass('hidden');
		this.domBtnNext.removeClass('hidden').click(function() {
			guesser.next();
		});

	}, // -- guess

	// ### Creates vector feature for a guess
	getVector: function(label, from, to) {
		var style = new ol.style.Style({ 
			rules: [
				// Lines
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
			  // Starting point
			  new ol.style.Rule({
			    filter: 'geometryType("point") && which == "guess"',
			    symbolizers: [
			      new ol.style.Shape({
			        size: 40,
			        fillColor: '#fff',
			        fillOpacity: 0.5,
			        strokeColor: '#fc0',
			        strokeOpacity: 1,
			        strokeWidth: 3
			      }),
			      new ol.style.Text({
			        color: '#000',
			        text: ol.expr.parse('label'),
			        fontFamily: 'Calibri,sans-serif',
			        fontSize: 14
			      })
			    ]
			  }),
			  // Ending point
			  new ol.style.Rule({
			    filter: 'geometryType("point") && which == "answer"',
			    symbolizers: [
			      new ol.style.Shape({
			        size: 40,
			        fillColor: '#0f0',
			        fillOpacity: 0.5,
			        strokeColor: '#393',
			        strokeOpacity: 1,
			        strokeWidth: 2
			      })
			    ]
			  })
			] }); // -- style
		
		var features = [
				{
					// Line from A to B
					type: 'Feature',
					properties: { color: '#fff' },
					geometry: {
						type: 'LineString', coordinates: [from, to] }
				},{
					// Starting point (the guess)
					type: 'Feature',
					properties: { 
						label: label, which: 'guess' },
					geometry: {
						type: 'Point', coordinates: from }
				},{
					// Ending point (the real answer)
					type: 'Feature',
					properties: {
						label: label, which: 'answer' },
					geometry: {
						type: 'Point', coordinates: to }
				}
			];

		return new ol.layer.Vector({
				style: style,
				source: new ol.source.Vector({
				 projection: map.getView().getProjection(),
				 parser: new ol.parser.GeoJSON(),
				 data: { type: 'FeatureCollection',
				         features: features }
				})
	 		});
	} // -- getVector
};

// Load data and start game
$.getJSON('data/base.json', function(d) { guesser.configure(d); });