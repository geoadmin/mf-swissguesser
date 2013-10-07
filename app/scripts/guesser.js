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
	user: { score: 0, collection: [] },

	// State variables
	config: null, 
	overlay: null, 
	overlayhtml: null,
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
	domBtnGuess:  	$('#btn-guess'), 
	domStartBox: 	$('#d-start'),
	domPhotoBox: 	$('#d-photobox'), 
	domLightBox: 	$('#d-lightbox'), 
	domPhotoInf: 	$('#row-info'),

	// ### Initial setup
	configure: function(json) {

		var self = this;
		self.config = json.conf;
		self.collection = json.data;

		// Check for anchor and clear it
		if (location.href.indexOf('#')>0) 
			  location.href = location.href.substring(0, 
			  	location.href.lastIndexOf('/'));

		// New window all external links
		$('a[href^="http:"]').attr('target', '_blank');

		// Fullscreen
		$('.lightbox').on('shown.bs.modal', function () {
			$('.modal-backdrop.in').css('opacity', 1);
		}).on('hidden.bs.modal', function () {
			// Clear backdrops properly (bug?)
			$('.modal-backdrop.in').remove();
		});

		// Init resizing
		self.resize();
		$(window).on('resize', function() { self.resize(); });

		// Init photo zoom and tooltip
		$('.d-photo', self.domPhotoBox).click(function() {
			self.domLightBox.modal();
		}).tooltip({
			title: $('.d-photo-text').text(),
			placement: 'bottom',
			container: 'body'
		});
		$('#row-info button:first').click(function(){ 
			$('.d-photo', self.domPhotoBox).tooltip('show'); 
		});

		// Bind guess button
		$(self.domBtnGuess).click(function(evt) {
			$(self.overlay.getElement()).hide();
			$(this).addClass('disabled');
			evt.preventDefault(); 
			self.guess();
			return false;
		});

		// Bind continue button
		this.domBtnNext.click(function() {
			$(this).addClass('hidden');
			self.domBtnGuess
				.removeClass('disabled').addClass('hidden')
					.prev().removeClass('hidden');
			guesser.next();
		});

		// Bind switcher buttons
		$('.mobile-switch button').click(function() {
			var t = $(this).attr('data-target');
			var tgt = $(t);
			$('.container-main > div.on').removeClass('on');
			tgt.addClass('on');
			var navMobileSwitch = $('.navbar-toggle.mobile-switch');
			$('.active', navMobileSwitch)
				.removeClass('active')
				.parent().find('[data-target="' + t + '"]')
					.addClass('active');
			$('.slideleft,.slideright').removeClass('slideleft slideright');
			if (t == '#column-map') {
				if (map) map.updateSize();
				tgt.addClass('slideleft');
			} else {
				tgt.addClass('slideright');
			}
		});
		//$('.container-main > div.on:last').removeClass('on');

		// Show start game
		$('#d-start').modal();
	},

	// ### Position the map container
	resize: function() {
		var frameheight = $(window).height(),
			headheight = $('#header').height(),
			footheight = $('#row-info').height();
		frameheight -= headheight + footheight;
		// Adjust height to fit screen
		$('.container-main')
			.css('height', (frameheight - 10) + 'px');
		$('.d-photo', this.domPhotoBox)
			.css('height', (frameheight - 15) + 'px');
		//this.domPhotoBox.scrollTop(this.domPhotoBox.height()*2);
		if (map && typeof map.updateSize == 'function') map.updateSize();
	},

	// ### Load image data
	loader: function(metadata) {

		// Get image data
		var imgbox = this.domPhotoBox,
			infobox = this.domPhotoInf,
			imgsrc = 
				this.config.dataPrefix + metadata.id + 
				this.config.dataSuffix;

		// Load images
		$('.d-photo').css('background-image', 'url(' + imgsrc + ')');
		$('img', this.domLightBox).attr('src', imgsrc);
		$('img', this.domResults).attr('src', imgsrc);

		// Populate components
		$('h4', infobox).attr('title', metadata.id);
		$('.image-count', infobox).html(this.currentIndex+1);
		$('.image-total', infobox).html(this.user.collection.length);
		$('.total', infobox).html(this.user.score);

		// Result box description
		$('.info', this.domResults).html(metadata[this.lang]);
	
		// Start the challenge
		guesser.challenge(map, [metadata.y, metadata.x]);

	},

	// ### Continue to next image
	next: function() {

		++this.currentIndex;
		///console.log("Advancing to next image", this.currentIndex);

		// Continue to next image
		this.loader( this.user.collection[this.currentIndex] );

		// On mobile, switch tabs
		$('.mobile-switch button:first').click();

		// Re-center map
		geoadmin.reset();

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

	},

	getimage: function() {
		if (++this.igetctr > 10) return this.collection[0];
		var l = this.collection.length;
		var i = parseInt(Math.random() * l);
		///console.log('Picking', i, '/', l);
		var r = this.collection[i];
		if (r.shown) {
			return this.getimage();
		} else {
			r.shown = true;
			return r;
		}
	},

	// ### Start challenge convenience function
	start: function() {
		if (this.collection == null)
			return alert('Error: data unavailable, cannot start');

		this.user.collection = [];
		for (var i = 0; i < 5; i++) {
			this.igetctr = 0;
			this.user.collection.push(this.getimage());
		}
		this.loader( this.user.collection[0] );

		// Clear loader
		$('#loading').remove();
		$('.container-main > .hidden').removeClass('hidden');
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
		
		// Save overlay content and clear
		this.overlayhtml = this.domOverlay.html();
		this.domOverlay.html('');

		// Create an Overlay
		this.overlay =
			new ol.Overlay({
				element: this.domOverlay[0]
			});
		olMap.addOverlay(this.overlay);

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
		var element = $(self.overlay.getElement());
		this.position = evt.getCoordinate();
		///console.log(this.position);

		element.css('background-image',
			"url('images/" + (self.currentIndex+1) + ".png')");
		
		element.popover('destroy');
		self.overlay.setPosition(this.position);

		// Show the overlay
		element.popover({ 
			'placement': 'top',
			'animation': false, 
			'html': true, 
			'content': this.overlayhtml
		});
		element.popover('show').show();
    
		// Enable link button
		$(self.domBtnGuess).prev().addClass('hidden');
		$(self.domBtnGuess).removeClass('hidden');

	}, // -- place

	// ### Submit a guess
	guess: function() {
		///console.log('Making guess', this.currentIndex, this.position, this.currentAnswer);
	
		// Deactivate guessing for this round
		this.active = false;

		// Zoom map out
		var view = map.getView().getView2D();
		view.setZoom(0);

		// Sets up a new vector layer
		var vectorGuess = this.getVector(
			this.currentIndex+1, this.position, this.currentAnswer);

		// Add layer to the map
		map.addLayer(vectorGuess);

		// Center map on guess
		var minx = (this.position[0] < this.currentAnswer[0]) ? 
							this.position[0] : this.currentAnswer[0],
			maxx = (this.position[0] >= this.currentAnswer[0]) ? 
							this.position[0] : this.currentAnswer[0],
			miny = (this.position[1] < this.currentAnswer[1]) ? 
							this.position[1] : this.currentAnswer[1],
			maxy = (this.position[1] >= this.currentAnswer[1]) ? 
							this.position[1] : this.currentAnswer[1];
		var extent = [minx, miny, maxx, maxy];
		///console.log('Zooming to', extent);

		// Fit viewport on guess
		// TODO: https://github.com/geoadmin/web-storymaps/issues/20
		view.fitExtent(extent, map.getSize());
		view.setCenter([this.currentAnswer[0],this.currentAnswer[1]]);
		
		// Calculate distance to answer (km)
		var dist = geoadmin.getDistanceEuclidian(
			this.position, this.currentAnswer) / 1000;

		// Calculate score
		var score = (dist < 180) ? 
			parseInt(Math.abs(180-dist)/7)*100
			: 0;
		this.user.score += score;

		// Hide the overlays
		this.domOverlay.popover('hide');
		this.domLocator.addClass('hidden');

		// Update dialog with score results
		$('.score', this.domResults).html(score);
		$('.total', this.domResults).html(this.user.score);
		$('.distance', this.domResults).html(parseInt(dist)); //TODO: format
		$('.total', this.domPhotoInf).html(this.user.score);
		
		// Generate a comment
		var comment = (score < 1000) ? "Better luck next time..." :
		              (score < 2000) ? "Well done." : 
		                               "Excellent!";
		this.domResults.find('.comment').html(comment); //TODO: i18n

		// Show dialog and get ready to continue the game
		this.domResults.removeClass('hidden');
		this.domBtnNext.parent().find('button').addClass('hidden');
		this.domBtnNext.removeClass('hidden');

		// Check end game status
		if (this.currentIndex+1 == this.user.collection.length) {
			this.finish();
		}

	}, // -- guess

	// ### Creates vector feature for a guess
	getVector: function(label, from, to) {
		var imageUrl = 'images/' + label + '.png';
		var style = new ol.style.Style({ 
			rules: [
				// Lines
			  new ol.style.Rule({
			  	filter: 'geometryType("linestring")',
			    symbolizers: [
			      new ol.style.Stroke({
			        color: '#f70',
			        width: 3,
			        opacity: 1
			      })
			    ]
			  }),
			  // Starting point
			  new ol.style.Rule({
			    filter: 'geometryType("point") && which == "guess"',
			    symbolizers: [
			      new ol.style.Icon({
			      	url: imageUrl,
			      	width: 33, height: 44,
			      	yOffset: -18
			      })
			    ]
			  }),
			  // Ending point 
			  new ol.style.Rule({
			    filter: 'geometryType("point") && which == "answer"',
			    symbolizers: [
			    	new ol.style.Icon({
			      	url: 'images/G.png',
			      	width: 33, height: 44,
			      	yOffset: -18
			      })
			    /*
			      new ol.style.Shape({
			        size: 20,
			        fill: new ol.style.Fill({color: '#9d9', opacity:1}),
			        opacity: 1,
			        stroke: new ol.style.Stroke({
			          color: '#3f3',
			          width: 2,
			          opacity: 1
			        })
			      }) */
			    ]
			  })
			] }); // -- style
		
		var features = [
				{
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
				},{
					// Line from A to B
					type: 'Feature',
					properties: { color: '#fff' },
					geometry: {
						type: 'LineString', coordinates: [from, to] }
				}
			];

		return new ol.layer.Vector({
				style: style,
				source: new ol.source.Vector({
				 parser: new ol.parser.GeoJSON(),
				 projection: map.getView().getProjection(),
				 data: { type: 'FeatureCollection',
				         features: features }
				})
	 		});
	} // -- getVector
};

// Useful for iOS debugging (disable in production!)
window.onerror = function(m,u,l) { alert(m+'\n'+u+'\n'+l); };

// Load translation (i18next)
i18n.init({ 
  detectLngQS: 'lang', 
  fallbackLng: 'en',
  resGetPath: 'data/locale/__lng__/__ns__.json',
  //useLocalStorage: true, localStorageExpirationTime: 86400000
}, function(t) { $("*[data-i18n]").i18n(); });

$(window).load(function() { 
	geoadmin.init(); // Load the map
	$.getJSON('data/base.json', function(d) { 

		guesser.configure(d); // Load data
		guesser.start(); // Start the game

	});
});