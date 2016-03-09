/*
* jumpyScroll - jQuery plugin
* copyright 2016, windstarter
* Only for the sale at the envato codecanyon
*/

(function($) {
'use strict';

    /**
     * initialize plugin
     * @param  object options user-defined options
     */
    $.fn.jumpyScroll = function(options) {
        var settings = $.fn.jumpyScroll.settings = $.fn.jumpyScroll.init(options);
        var top = $(window).scrollTop();
        var animating = false;
        var delay = 300;
        var timeout = null;
        var touchPoint;
        var firstMove = true;
        var navPanel, infoPanel;
        var hash;
        var action = 'hash';

        return this.each(function() {
            $(settings.pageElement).css('height', '100vh');
            $(settings.pageElement).css('overflow', 'hidden');
            $(settings.pageElement).addClass('animated');
            $(settings.pageElement).css({
                'webkit-animation-duration': settings.speed / 1000 + 's',
                'animation-duration': settings.speed / 1000 + 's'
            });

            $(settings.pageElement).on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                $(this).removeClass(settings.animation);
                animating = false;
            });

            navPanel = $('<div />').appendTo($(settings.pageElement).parent()).addClass('jumpyscroll nav');

            if (settings.info) {
                var pageCount = $(settings.pageElement).length;
                var pageNo = 1;
                infoPanel = $('<div />').appendTo($(settings.pageElement).parent()).addClass('jumpyscroll info').attr('tabindex', '-1');
                $('<span />').appendTo(infoPanel).html(settings.infoText.replace(/\${pageNo}/, pageNo).replace(/\${pageCount}/, pageCount));
            }

            if (settings.keys) {
                $(document).on('keydown', function(event) {
                    if (event.ctrlKey) {
                        return;
                    }
                    if (event.target.nodeName.toLowerCase() === 'body') {
                        event.preventDefault();
                    }
                });

                $(document).on('keyup', function(event) {
                    event.preventDefault();
                    if (event.target.nodeName.toLowerCase() === 'body' && [32, 33, 34, 38, 40].indexOf(event.keyCode) >= 0) {
                        action = event.type;
                        $.fn.jumpyScroll.toNearby(
                            [32, 34, 40].indexOf(event.keyCode) >= 0,
                            [33, 38].indexOf(event.keyCode) >= 0
                        );
                    }
                });
            }

            if (settings.nav) {
                var prevButton = $('<div />').appendTo(navPanel).addClass('prev').html(settings.prevLabel);
                var nextButton = $('<div />').appendTo(navPanel).addClass('next').html(settings.nextLabel);
                $('.jumpyscroll.nav .prev, .jumpyscroll.nav .next').on('click', function(event) {
                    event.preventDefault();
                    action = event.type;
                    $.fn.jumpyScroll.toNearby($(this).hasClass('next'), $(this).hasClass('prev'));
                });
                $('.jumpyscroll.nav .prev, .jumpyscroll.nav .next').on('touchstart', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    action = event.type;
                    $.fn.jumpyScroll.toNearby($(this).hasClass('next'), $(this).hasClass('prev'));
                });
            }

            if (settings.dots) {
                var dotsWrapper = $('<div />').appendTo(navPanel).addClass('dots');
                $(settings.pageElement).each(function(index, el) {
                    $('<div />').appendTo(dotsWrapper).addClass('dot').html(settings.dotLabel);
                });
                $('.dot.active').removeClass('active');
                $('.dot').eq(settings.currentIndex).addClass('active');
                $(document).on('click', '.dot', function(event) {
                    event.preventDefault();
                    action = event.type;
                    var targetIndex = $('.dot').index($(this));
                    $(window).trigger('scroll', targetIndex);
                });
            }

            if (settings.touch) {
                $(document).on('touchstart', settings.pageElement, function(event) {
                    touchPoint = event.originalEvent.changedTouches[event.originalEvent.changedTouches.length - 1];
                });
                $(document).on('touchmove', settings.pageElement, function(event) {
                    if (event.originalEvent.changedTouches.length > 0) {
                        var direction = touchPoint.clientY - event.originalEvent.changedTouches[event.originalEvent.changedTouches.length - 1].clientY;
                        if (Math.abs(direction) > settings.touchLimit) {
                            event.preventDefault();
                        }
                    }
                });
                $(document).on('touchend', settings.pageElement, function(event) {
                    if (event.originalEvent.changedTouches.length > 0) {
                        var direction = touchPoint.clientY - event.originalEvent.changedTouches[event.originalEvent.changedTouches.length - 1].clientY;
                        if (Math.abs(direction) > settings.touchLimit) {
                            action = event.type;
                            $.fn.jumpyScroll.toNearby(
                                direction > settings.touchLimit,
                                direction < -settings.touchLimit
                            );
                        }
                    }
                });
            }

            hash = window.location.hash;
            $(window).on('hashchange', function(event) {
                event.preventDefault();
                 action = event.type;
                if ($(settings.pageElement + window.location.hash).length > 0) {
                    $(window).trigger('scroll', $(settings.pageElement).index($(settings.pageElement + window.location.hash)));
                }
            });

            $(document).on('onBeforeScroll', function() {
                settings.onBeforeScroll.call();
            });

            $(document).on('onAfterScroll', function(event, index) {
                settings.onAfterScroll.call(this, index);
                if (settings.info) {
                    var pageCount = $(settings.pageElement).length;
                    $('.jumpyscroll.info span').html(settings.infoText.replace(/\${pageNo}/, ++index).replace(/\${pageCount}/, pageCount));
                }
            });

            $(document).on('onScroll', function(e, index) {
                $(window).trigger('scroll', index);
                settings.onScroll.call();
            });

            // function touchStartHandler(event) {
            //     event.preventDefault();
            //     touchPoint = event.changedTouches[event.changedTouches.length - 1];
            // }

            // function touchEndHandler(event) {
            //     event.preventDefault();
            //     var direction = touchPoint.clientY - event.changedTouches[event.changedTouches.length - 1].clientY;
            //     $.fn.jumpyScroll.toNearby(
            //         direction > settings.touchLimit,
            //         direction < -settings.touchLimit
            //     );
            // }

             $(settings.pageElement).on('onwheel mousewheel wheel', function(event) {
                event.stopPropagation();
                if (event.ctrlKey === false) {
                    event.preventDefault();
                    action = event.type;
                    $.fn.jumpyScroll.toNearby(
                        event.originalEvent.deltaY > 0,
                        event.originalEvent.deltaY < 0
                    );
                }
            });

            $(window).on('resize', function(event) {
                event.preventDefault();
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    animating = false;
                    action = event.type;
                    $(document).trigger('scroll', settings.currentIndex);
                }, delay);
            });

            $(window).on('scroll', function(event, targetIndex) {
                var targetSection, currentDelay;
                currentDelay = delay;
                if (!animating && (targetIndex !== undefined)) {
                    if (firstMove) {
                        currentDelay = 10;
                        firstMove = false;
                    }
                }
                if (!animating && (targetIndex !== undefined)) {
                    clearTimeout(timeout);
                    timeout = setTimeout(function() {
                        targetSection = $(settings.pageElement).eq(targetIndex);
                        if (targetIndex !== settings.currentIndex) {
                            $(document).trigger('onBeforeScroll', [targetIndex]);
                            animating = true;
                            if (settings.dots) {
                                $('.dot.active').removeClass('active');
                                $('.dot').eq(targetIndex).addClass('active');
                            }
                        }
                        targetSection[0].scrollIntoView(true);
                        top = window.pageYOffset || document.body.scrollTop;
                        if (targetIndex !== settings.currentIndex) {
                            targetSection.addClass(settings.animation);
                            $(document).trigger('onAfterScroll', [targetIndex]);
                        }
                        settings.currentIndex = targetIndex;
                    }, currentDelay);
                }
                if (!animating && (targetIndex === undefined) && (action !== 'hash')) {
                    var thisMoveTop = window.pageYOffset || document.documentElement.scrollTop;
                    $.fn.jumpyScroll.toNearby(
                        thisMoveTop > top,
                        thisMoveTop < top
                    );
                }
                if (action === 'hash') {
                    var index = $(settings.pageElement).index($(settings.pageElement + window.location.hash));
                    settings.currentIndex = index;
                    if (settings.dots) {
                        $('.dot.active').removeClass('active');
                        $('.dot').eq(index).addClass('active');
                    }
                    $(document).trigger('onAfterScroll', [index]);
                }
            });

        });

    };


    $.fn.jumpyScroll.init = function(options) {

        var defaults = {
            pageElement: 'section',
            touch: true,
            touchLimit: 5,
            keys: true,
            animation: 'zoomIn',
            speed: 500,
            nav: true,
            nextLabel: '',
            prevLabel: '',
            dots: true,
            dotLabel: '',
            info: false,
            currentIndex: 0,
            infoText: 'Page ${pageNo} from ${pageCount}',
            onBeforeScroll: function(index) {},
            onAfterScroll: function(index) {},
            onScroll: function(e, index) {}
        };

        var re;
        var animateRule = false;
        // $.each(document.styleSheets, function(index, value) {
        //     $.each(value.cssRules, function(index, value) {
        //         re = new RegExp('^(\.)' + settings.animation + '$');
        //         if (re.test(value.selectorText)) {
        //                 animateRule = true;
        //             }
        //     });
        // });
        // if (!animateRule) {
        //     options.animation = 'ease';
        // }

        return $.extend({}, defaults, options);
    };

    /**
    * fire scroll event with target index parameter
    * @param  boolean conditionNext next element condition
    * @param  boolean conditionPrev previous element condition
    */
    $.fn.jumpyScroll.toNearby = function(conditionNext, conditionPrev) {
        var nearbyIndex = this.settings.currentIndex;
        switch (true) {
            case conditionNext:
                nearbyIndex++;
                nearbyIndex = Math.min(nearbyIndex, $(this.settings.pageElement).length - 1);
            break;
            case conditionPrev:
                nearbyIndex--;
                nearbyIndex = Math.max(nearbyIndex, 0);
            break;
        }
        $(window).trigger('scroll', nearbyIndex);
    };

    /**
     * scroll to section by index
     * @param  integer index An integer indicating the position of the element
     */
    $.fn.jumpyScroll.toIndex = function(index) {
        $(window).trigger('scroll', index);
    };

    /**
     * scroll to next section
     */
    $.fn.jumpyScroll.next = function() {
        this.toNearby(true, false);
    };

    /**
     * scroll to previous section
     */
    $.fn.jumpyScroll.prev = function() {
        this.toNearby(false, true);
    };

    /**
     * destroy plugin
     * @return {[type]} [description]
     */
    $.fn.jumpyScroll.destroy = function() {

    };

}(jQuery));
