(function($) {
'use strict';

    /**
     * returns first element in browser viewport
     * @param  string element full-screen element selector
     * @return jQuery object
     */
    function firstInViewport(element) {
        var first, edge, min;
        var viewportTop = $(window).scrollTop();
        min = Math.max(
          document.body.scrollHeight, document.documentElement.scrollHeight,
          document.body.offsetHeight, document.documentElement.offsetHeight,
          document.body.clientHeight, document.documentElement.clientHeight
        );
        $(element).each(function(index, el) {
            edge = $(this).offset().top;
            if (Math.min(Math.abs(edge - viewportTop), min) < min) {
                min = Math.min(Math.abs(edge - viewportTop), min);
                first = $(this);
            }
        });
        return first;
    }

    /**
     * fire scroll event with target index parameter
     * @param  boolean conditionNext next element condition
     * @param  boolean conditionPrev previous element condition
     * @param  string pageElement full-screen element selector
     */
    function nearbyAction(conditionNext, conditionPrev, pageElement) {
        var index = -1;
        var targetSection, targetIndex;
        var thisSection = firstInViewport(pageElement);
        switch (true) {
            case conditionNext:
            targetSection = thisSection.next(pageElement);
            break;
            case conditionPrev:
            targetSection = thisSection.prev(pageElement);
            break;
        }
        if (targetSection !== undefined) {
            targetIndex = $(pageElement).index(targetSection);
        } else {
            targetIndex = $(pageElement).index(thisSection);
        }
        if (targetIndex != -1) {
            $(document).trigger('scroll', targetIndex);
        }
    }

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
            var currentSection = 0;
            var navPanel, infoPanel;

            $(settings.pageElement).css('height', '100vh');
            $(settings.pageElement).addClass('animated');
            $(settings.pageElement).css({
                'webkit-animation-duration': settings.speed / 1000 + 's',
                'animation-duration': settings.speed / 1000 + 's'
            });

            $(settings.pageElement).on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                $(this).removeClass(settings.animation);
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
                        nearbyAction(
                            [32, 34, 40].indexOf(event.keyCode) >= 0,
                            [33, 38].indexOf(event.keyCode) >= 0,
                        settings.pageElement);
                    }
                });
            }

            if (settings.nav) {
                var prevButton = $('<div />').appendTo(navPanel).addClass('prev').html(settings.prevLabel);
                var nextButton = $('<div />').appendTo(navPanel).addClass('next').html(settings.nextLabel);
                $('.jumpyscroll.nav .prev, .jumpyscroll.nav .next').on('click', function(event) {
                    event.preventDefault();
                    nearbyAction($(this).hasClass('next'), $(this).hasClass('prev'), settings.pageElement);
                });
                $('.jumpyscroll.nav .prev, .jumpyscroll.nav .next').on('touchstart', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    nearbyAction($(this).hasClass('next'), $(this).hasClass('prev'), settings.pageElement);
                });
            }

            if (settings.dots) {
                var dotsWrapper = $('<div />').appendTo(navPanel).addClass('dots').attr('tabindex', '-1');
                $(settings.pageElement).each(function(index, el) {
                    $('<div />').appendTo(dotsWrapper).addClass('dot').attr('tabindex', '-1');
                });
                var thisSection = firstInViewport(settings.pageElement);
                var targetIndex = $(settings.pageElement).index(thisSection);
                $('.dot.active').removeClass('active');
                $('.dot').eq(targetIndex).addClass('active');
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
                            nearbyAction(
                                direction > settings.touchLimit,
                                direction < -settings.touchLimit,
                            settings.pageElement);
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
                nearbyAction(
                    direction > settings.touchLimit,
                    direction < -settings.touchLimit,
                    settings.pageElement
                );
            }

             $(settings.pageElement).on('onwheel mousewheel wheel', function(event) {
                event.stopPropagation();
                if (event.ctrlKey === false) {
                    event.preventDefault();
                    nearbyAction(
                        event.originalEvent.deltaY > 0,
                        event.originalEvent.deltaY < 0,
                        settings.pageElement
                    );
                } else {
                }
            });

            $(window).on('resize', function(event) {
                event.preventDefault();
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    animating = false;
                    var thisSection = firstInViewport(settings.pageElement);
                    var targetIndex = $(settings.pageElement).index(thisSection);
                    $(document).trigger('scroll', targetIndex);
                }, delay);
            });

            $(window).on('scroll', function(event, targetIndex) {
                console.log('scroll', animating);
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
                        var thisSection = firstInViewport(settings.pageElement);
                        if (targetIndex === undefined) {
                            var thisMoveTop = window.pageYOffset || document.documentElement.scrollTop;
                            if (thisMoveTop > top) {
                                targetSection = thisSection.next(settings.pageElement);
                            }
                            else {
                                targetSection = thisSection.prev(settings.pageElement);
                            }
                        }
                        else {
                            targetSection = $(settings.pageElement).eq(targetIndex);
                        }
                        if (targetSection.length === 0) {
                            targetSection = thisSection;
                        }
                        $(document).trigger('onBeforeScroll', [targetIndex]);
                        animating = true;
                        var nextTargetIndex = $(settings.pageElement).index(targetSection);
                        if (settings.dots) {
                            $('.dot.active').removeClass('active');
                            $('.dot').eq(nextTargetIndex).addClass('active');
                        }
                        $(document).scrollTop(targetSection.position().top);
                        targetSection[0].scrollIntoView(true);
                        top = window.pageYOffset || document.body.scrollTop;
                        targetSection.addClass(settings.animation);
                        $(document).trigger('onAfterScroll', [nextTargetIndex]);
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
