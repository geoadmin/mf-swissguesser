var lang = 'DE';

/* Setup Bootstrap components */

$('.modal.fade').on('shown.bs.modal', function () {
	$('#btn-start').fadeOut();
}).on('hidden.bs.modal', function () {
	$('#btn-start').fadeIn('slow');
});

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

$('.d-photo').click(function() {
	if ($(this).hasClass('fullscreen')) {
		$(this).removeClass('fullscreen');
	} else {
		$(this).addClass('fullscreen');
	} });

function nextImage() {
	if (++currentIndex == collection.length) 
		currentIndex = 0;
	loadImage( collection[currentIndex] );
}

$('#btn-guess').click(function() {

});

var Guess = Backbone.Model.extend({
	validate: function(attr) {},
	initialize: function() {
		// Update overlay
		this.on('change:dom', function(model) {

			// Get current template
			var dom = $(model.get('dom'));
			model.set({ html: dom.html() });
			dom.html(''); // and clear

			// Create an Overlay
			model.set({ overlay: 
				new ol.Overlay({
					map: map, element: dom[0]
				})
			});
		});		

		// Update placement
		this.on('change:position', function(model) {
			var position = model.get('position');
			model.get('overlay').setPosition(position);
			console.log('Guessed ' + position);

			model.get('dom')
				.popover({ 
					'placement': 'top', 'html': true, 
					'content': model.get('html') })
				.popover('show');
		});
	}
});

var guess = new Guess({ dom:'#map-overlay' });

map.on('click', function(evt) {
	guess.set({ position: evt.getCoordinate() });
});