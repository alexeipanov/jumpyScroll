$(document).ready(function() {
	$(document).jumpyScroll(
        {
            pageElement: 'section',
            animation: 'zoomIn',
            info: true,
            onAfterScroll: function(index) {
                switch (index) {
                    // case 2:
                    //     popupMessage(
                    //         $('div.popup'),
                    //         '<i class="fa fa-bell fa-2x"></i><div class="10u">Hello!<br>This is notification message for third section.',
                    //          6000);
                    //     break;
                    // default:
                    //     break;
                    case 2:
                        post('pause');
                        $.fn.jumpyScroll.settings.infoText = 'This is <strong style="color: red;">third</strong> page!';
                        break;
                    case 3:
                        post('seekTo', 54);
                        post('play');
                        break;
                    default:
                        post('pause');
                        $.fn.jumpyScroll.settings.infoText = 'Page ${pageNo} from ${pageCount}';
                        break;
                }
            },
            onBeforeScroll: function(index) {
                // $('.popup .close').trigger('click');
                // var animations = ['bounce', 'flash', 'pulse', 'rubberBand', 'shake', 'headShake', 'swing', 'tada', 'wobble', 'jello', 'bounceIn', 'bounceInDown', 'bounceInLeft', 'bounceInRight', 'bounceInUp', 'bounceOut', 'bounceOutDown', 'bounceOutLeft', 'bounceOutRight', 'bounceOutUp', 'fadeIn', 'fadeInDown', 'fadeInDownBig', 'fadeInLeft', 'fadeInLeftBig', 'fadeInRight', 'fadeInRightBig', 'fadeInUp', 'fadeInUpBig', 'fadeOut', 'fadeOutDown', 'fadeOutDownBig', 'fadeOutLeft', 'fadeOutLeftBig', 'fadeOutRight', 'fadeOutRightBig', 'fadeOutUp', 'fadeOutUpBig', 'flipInX', 'flipInY', 'flipOutX', 'flipOutY', 'lightSpeedIn', 'lightSpeedOut', 'rotateIn', 'rotateInDownLeft', 'rotateInDownRight', 'rotateInUpLeft', 'rotateInUpRight', 'rotateOut', 'rotateOutDownLeft', 'rotateOutDownRight', 'rotateOutUpLeft', 'rotateOutUpRight', 'hinge', 'rollIn', 'rollOut', 'zoomIn', 'zoomInDown', 'zoomInLeft', 'zoomInRight', 'zoomInUp', 'zoomOut', 'zoomOutDown', 'zoomOutLeft', 'zoomOutRight', 'zoomOutUp', 'slideInDown', 'slideInLeft', 'slideInRight', 'slideInUp', 'slideOutDown', 'slideOutLeft', 'slideOutRight', 'slideOutUp'];
                // var rand = Math.floor(Math.random() * animations.length);
                // $.fn.jumpyScroll.settings.animation = animations[rand];
            }
        }
    );

	$('a#goto3').on('click', function(event) {
		event.preventDefault();
		$(document).jumpyScroll.toIndex(2);
	});

	// geocoder = new google.maps.Geocoder();
 //    geocoder.geocode({
 //        "address": "22 Pitt St, Sydney, NSW 2000, Australia"
 //    }, function(results, status) {
 //        if (status == google.maps.GeocoderStatus.OK) {
 //            point = results[0].geometry.location;
 //            var myOptions = {
 //                zoom: 16,
 //                center: point,
 //                mapTypeId: google.maps.MapTypeId.ROADMAP
 //            };
 //            map = new google.maps.Map(document.getElementById("map"), myOptions);
 //            map.setCenter(point);
 //            var marker = new google.maps.Marker({
 //                map: map,
 //                position: point,
 //                title: "My Corp Inc",
 //                infowindow: new google.maps.InfoWindow({
 //                    content: "22 Pitt St"
 //                })
 //            });
 //            google.maps.event.addListener(marker, "click", function() {
 //                marker.infowindow.open(map, marker);
 //            });
 //        }
 //    });

 //    $('.slider').owlCarousel({
 //        center: false,
	// autoplay: true,
 //        items: 1,
 //    });
 //
    // function popupMessage(element, message, timeout) {
    //     element.fadeIn();
    //     element.find('.message').html(message);
    //     element.delay(timeout).fadeOut();
    // }

    // $('.popup .close').on('click', function(event) {
    //     event.preventDefault();
    //     $(this).parent().hide();
    // });

    var player = $('iframe');
    var playerOrigin = '*';

    function post(action, value) {
        var data = {
          method: action
        };
        
        if (value) {
            data.value = value;
        }
        
        var message = JSON.stringify(data);
        // player[0].contentWindow.postMessage(message, playerOrigin);
    }

});

