$(document).ready(function () {
	
	$('.hamburger').on('click', function(event) {
		event.preventDefault();
		$('.sidebar').toggleClass('animateMenu');
	});

});