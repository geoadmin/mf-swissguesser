var lang = 'DE';

$('.modal.fade').on('shown.bs.modal', function () {
	$('#btn-start').fadeOut();
}).on('hidden.bs.modal', function () {
	$('#btn-start').fadeIn('slow');
});

var photoCollection = [], currentIndex = 0;

$.getJSON('data/photos.json', function(data) {
	photoCollection = data;
	loadImage( photoCollection[0] );
});

function loadImage(metadata) {
	$('#d-photo p').html(metadata['Beschreibung ' + lang]);
	var imgsrc = 'data/photos/' + metadata['Bildname'] + '_A1.jpg';
		$('#d-photo img').attr('src', imgsrc);
}

$('#btn-guess').click(function() {
	if (++currentIndex == photoCollection.length) 
			currentIndex = 0;
	loadImage( photoCollection[currentIndex] );
});