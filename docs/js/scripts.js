$(document).ready(function() {

    var animations = ['ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out', 'bounce', 'flash', 'pulse', 'rubberBand', 'shake', 'headShake', 'swing', 'tada', 'wobble', 'jello', 'bounceIn', 'bounceInDown', 'bounceInLeft', 'bounceInRight', 'bounceInUp', 'bounceOut', 'bounceOutDown', 'bounceOutLeft', 'bounceOutRight', 'bounceOutUp', 'fadeIn', 'fadeInDown', 'fadeInDownBig', 'fadeInLeft', 'fadeInLeftBig', 'fadeInRight', 'fadeInRightBig', 'fadeInUp', 'fadeInUpBig', 'fadeOut', 'fadeOutDown', 'fadeOutDownBig', 'fadeOutLeft', 'fadeOutLeftBig', 'fadeOutRight', 'fadeOutRightBig', 'fadeOutUp', 'fadeOutUpBig', 'flipInX', 'flipInY', 'flipOutX', 'flipOutY', 'lightSpeedIn', 'lightSpeedOut', 'rotateIn', 'rotateInDownLeft', 'rotateInDownRight', 'rotateInUpLeft', 'rotateInUpRight', 'rotateOut', 'rotateOutDownLeft', 'rotateOutDownRight', 'rotateOutUpLeft', 'rotateOutUpRight', 'hinge', 'rollIn', 'rollOut', 'zoomIn', 'zoomInDown', 'zoomInLeft', 'zoomInRight', 'zoomInUp', 'zoomOut', 'zoomOutDown', 'zoomOutLeft', 'zoomOutRight', 'zoomOutUp', 'slideInDown', 'slideInLeft', 'slideInRight', 'slideInUp', 'slideOutDown', 'slideOutLeft', 'slideOutRight', 'slideOutUp'];

    var topanimations = ['ease-in-out', 'pulse', 'bounceInRight', 'fadeIn', 'fadeInRight', 'flipInX', 'flipInY', 'lightSpeedIn', 'rotateIn', 'rotateInUpLeft', 'rollIn', 'zoomIn', 'slideInRight'];

    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    $('a#goto3').on('click', function(event) {
        event.preventDefault();
        window.jumpyScroll.toIndex(2);
    });

    $('a#gotonext').on('click', function(event) {
        event.preventDefault();
        window.jumpyScroll.next();
    });

    $('section form').on('submit', function(event) {
        event.preventDefault();
        window.jumpyScroll.next();
    });


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
        if (player.length > 0) {
            player[0].contentWindow.postMessage(message, playerOrigin);
        }
    }


    if ($('section.animation').length > 0) {
        window.jumpyScroll(
            {
                pageElement: 'section',
                speed: 800,
                dots: false,
                info: true,
                infoText: 'Effect ${pageNo} from ${pageCount}',
                onBeforeScroll: function(index) {
                    $('section.animation').eq(index).html('<h1>' + animations[index] + '</h1>').css('font-size', '5vw');
                    $('section.animation').eq(index).css('background-color', getRandomColor());
                    jumpyScroll.settings.animation = animations[index];
                }
            }
        );
        $('section.animation').eq(0).html('<h1>' + animations[0] + '</h1>').css('font-size', '5vw');
        $('section.animation').eq(0).css('background-color', getRandomColor());
        jumpyScroll.settings.animation = animations[0];
        // window.jumpyScroll.toIndex(0);
    }

    if ($('section.basedemo').length > 0) {
        window.jumpyScroll({
            animation: 'fadeIn',
            keys: true,
            onBeforeScroll: function(index) {
                jumpyScroll.settings.animation = topanimations[Math.floor(Math.random() * topanimations.length)];
            }
        });
    }

    if ($('section.custombutton').length > 0) {
        $('head').append('<link rel="stylesheet" href="css/custom-button.css" type="text/css" />');
        window.jumpyScroll(
            {
                info: false,
                dots: false,
                nextLabel: 'Continue',
            }
        );
    }

    if ($('section.awesomebuttons').length > 0) {
        $('head').append('<link rel="stylesheet" href="css/awesome-button.css" type="text/css" />');
        $('head').append('<link rel="stylesheet" href="css/font-awesome.css" type="text/css" />');
        window.jumpyScroll({
            prevLabel: '<i class="fa fa-arrow-up"></i>',
            nextLabel: '<i class="fa fa-arrow-down"></i>',
            dotLabel: '<i class="fa fa-dot-circle-o"></i>',
        });
    }

    if ($('section.customtransform').length > 0) {
        window.jumpyScroll({
            animation: 'ufo',
            speed: 1000,
        });
    }

    if ($('section.numbereddots').length > 0) {
        $('head').append('<link rel="stylesheet" href="css/numbered-dots.css" type="text/css" />');
        window.jumpyScroll({
            dotLabel: '<div></div>'
        });
    }

    if ($('section.events').length > 0) {
        window.jumpyScroll({
            onAfterScroll: function(index) {
                switch (index) {
                    case 0:
                        post('pause');
                        jumpyScroll.settings.infoText = 'This is <strong style="color: red;">first</strong> page!';
                        break;
                    case 1:
                        post('seekTo', 54);
                        post('play');
                        break;
                    default:
                        post('pause');
                        jumpyScroll.settings.infoText = 'Page ${pageNo} from ${pageCount}';
                        break;
                }
            },
            onBeforeScroll: function(index) {
                switch (index) {
                    default:
                        post('pause');
                        jumpyScroll.settings.infoText = 'Page ${pageNo} from ${pageCount}';
                        break;
                }
            }
        });
    }
});