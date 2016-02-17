$(document).ready(function() {
	$(document).jumpyScroll();

	$('a#goto3').on('click', function(event) {
		event.preventDefault();
		$(document).jumpyScroll.toIndex(2);
	});

	geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        "address": "22 Pitt St, Sydney, NSW 2000, Australia"
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            point = results[0].geometry.location;
            var myOptions = {
                zoom: 16,
                center: point,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            map = new google.maps.Map(document.getElementById("map"), myOptions);
            map.setCenter(point);
            var marker = new google.maps.Marker({
                map: map,
                position: point,
                title: "My Corp Inc",
                infowindow: new google.maps.InfoWindow({
                    content: "22 Pitt St"
                })
            });
            google.maps.event.addListener(marker, "click", function() {
                marker.infowindow.open(map, marker);
            });
        }
    });

 //    $('.slider').owlCarousel({
 //        center: false,
	// autoplay: true,
 //        items: 1,
 //    });

});