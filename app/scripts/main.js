var lang = 'DE';

$('.modal.fade').on('shown.bs.modal', function () {
	$('#btn-start').fadeOut();
}).on('hidden.bs.modal', function () {
	$('#btn-start').fadeIn('slow');
});

var collection, config, currentIndex = 0;

$.getJSON('data/base.json', function(json) {
	config = json.conf;
	collection = json.data;
	loadImage( collection[0] );
});

function loadImage(metadata) {
	$('#d-photo p').html(metadata[lang]);
	var imgsrc = config.dataPrefix + metadata.id + config.dataSuffix;
		$('#d-photo img').attr('src', imgsrc);
}

$('#btn-guess').click(function() {
	if (++currentIndex == collection.length) 
			currentIndex = 0;
	loadImage( collection[currentIndex] );
});