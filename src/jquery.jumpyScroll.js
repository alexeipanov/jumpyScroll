(function($) {
'use strict';

    /**
     * initialize jumpyScroll plugin
     * @param  object options user-defined options
     */
    $.fn.jumpyScroll = function(options) {
        return this.each(function() {
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
                info: true,
                infoText: 'Page ${pageNo} from ${pageCount}',
                onBeforeScroll: function(index) {},
                onAfterScroll: function(index) {},
                onScroll: function(e, index) {}
            };

            var settings = $.extend({}, defaults, options);
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
            //     settings.animation = 'ease';
            // }

            var top = $(window).scrollTop();
            var animating = false;
            var delay = 300;
            var timeout = null;
            var touchPoint;
            var firstMove = true;
            var currentIndex = 0;
            var navPanel, infoPanel;

            /**
             * fire scroll event with target index parameter
             * @param  boolean conditionNext next element condition
             * @param  boolean conditionPrev previous element condition
             * @param  string pageElement full-screen element selector
             */
            function toNearby(conditionNext, conditionPrev) {
                var nearbyIndex = currentIndex;
                switch (true) {
                    case conditionNext:
                        nearbyIndex++;
                        nearbyIndex = Math.min(nearbyIndex, $(settings.pageElement).length - 1);
                    break;
                    case conditionPrev:
                        nearbyIndex--;
                        nearbyIndex = Math.max(nearbyIndex, 0);
                    break;
                }
                $(document).trigger('scroll', nearbyIndex);
            }

            $(settings.pageElement).css('height', '100vh');
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
                        toNearby(
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
                    toNearby($(this).hasClass('next'), $(this).hasClass('prev'));
                });
                $('.jumpyscroll.nav .prev, .jumpyscroll.nav .next').on('touchstart', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    toNearby($(this).hasClass('next'), $(this).hasClass('prev'));
                });
            }

            if (settings.dots) {
                var dotsWrapper = $('<div />').appendTo(navPanel).addClass('dots').attr('tabindex', '-1');
                $(settings.pageElement).each(function(index, el) {
                    $('<div />').appendTo(dotsWrapper).addClass('dot').attr('tabindex', '-1');
                });
                $('.dot.active').removeClass('active');
                $('.dot').eq(currentIndex).addClass('active');
                $(document).on('click', '.dot', function(event) {
                    event.preventDefault();
                    var targetIndex = $('.dot').index($(this));
                    $(document).trigger('scroll', targetIndex);
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
                            toNearby(
                                direction > settings.touchLimit,
                                direction < -settings.touchLimit
                            );
                        }
                    }
                });
            }

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

            function touchStartHandler(event) {
                event.preventDefault();
                touchPoint = event.changedTouches[event.changedTouches.length - 1];
            }

            function touchEndHandler(event) {
                event.preventDefault();
                var direction = touchPoint.clientY - event.changedTouches[event.changedTouches.length - 1].clientY;
                toNearby(
                    direction > settings.touchLimit,
                    direction < -settings.touchLimit
                );
            }

             $(settings.pageElement).on('onwheel mousewheel wheel', function(event) {
                event.stopPropagation();
                if (event.ctrlKey === false) {
                    event.preventDefault();
                    toNearby(
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
                    $(document).trigger('scroll', currentIndex);
                }, delay);
            });

            $(window).on('scroll', function(event, targetIndex) {
                var targetSection, currentDelay;
                currentDelay = delay;
                if (!animating) {
                    if (firstMove) {
                        currentDelay = 10;
                        firstMove = false;
                    }
                }
                if (!animating) {
                    clearTimeout(timeout);
                    timeout = setTimeout(function() {
                        var thisSection = $(settings.pageElement).eq(currentIndex);
                        if (targetIndex === undefined) {
                            var thisMoveTop = window.pageYOffset || document.documentElement.scrollTop;
                            if (thisMoveTop > top) {
                                targetSection = thisSection.next(settings.pageElement);
                            }
                            else {
                                targetSection = thisSection.prev(settings.pageElement);
                            }
                            targetIndex = $(settings.pageElement).index(targetSection);
                        }
                        else {
                            targetSection = $(settings.pageElement).eq(targetIndex);
                        }
                        if (targetIndex !== currentIndex) {
                            $(document).trigger('onBeforeScroll', [targetIndex]);
                            animating = true;
                            if (settings.dots) {
                                $('.dot.active').removeClass('active');
                                $('.dot').eq(targetIndex).addClass('active');
                            }
                        }
                        targetSection[0].scrollIntoView(true);
                        top = window.pageYOffset || document.body.scrollTop;
                        if (targetIndex !== currentIndex) {
                            targetSection.addClass(settings.animation);
                            $(document).trigger('onAfterScroll', [targetIndex]);
                        }
                        currentIndex = targetIndex;
                    }, currentDelay);
                }
                else {
                    animating = false;
                }
            });
        });

    };

    /**
     * scroll to section by index
     * @param  integer index An integer indicating the position of the element
     * @return {[type]}       [description]
     */
    $.fn.jumpyScroll.toIndex = function(index) {
        $(window).trigger('scroll', index);
    };

    /**
     * scroll to next section
     * @return {Function} [description]
     */
    $.fn.jumpyScroll.next = function() {
        nearbyAction(true, false, settings.pageElement);
    };

    /**
     * scroll to previous section
     * @return {[type]} [description]
     */
    $.fn.jumpyScroll.prev = function() {
        nearbyAction(false, true, settings.pageElement);
    };

    /**
     * destroy plugin
     * @return {[type]} [description]
     */
    $.fn.jumpyScroll.destroy = function() {

    };

}(jQuery));
