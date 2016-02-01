$(document).ready(function() {
	$(document).jumpyScroll();

	$('a#goto3').on('click', function(event) {
		event.preventDefault();
		$(document).jumpyScroll.toIndex(2);
	});
});