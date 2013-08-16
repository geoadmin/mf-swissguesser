$('#d-start').on('shown.bs.modal', function () {
	$('#btn-start').fadeOut();
}).on('hidden.bs.modal', function () {
	$('#btn-start').fadeIn('slow');
});