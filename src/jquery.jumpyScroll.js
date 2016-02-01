(function($) {
'use strict';

    /**
     * returns first element in browser viewport
     * @param  {string} element full-screen element selector
     * @return {jQuery object}
     */
    function firstInViewport(element) {
        var first, edge, min;
        var viewportTop = $(window).scrollTop();
        var viewportBottom = $(window).scrollTop() + $(window).height();
        // var viewportTop = window.pageYOffset;
        // clientHeight
        // var viewportBottom = window.pageYOffset + document.body.innerHeight;
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
     * fire scroll event with target index parameter next or previous element index, relative to the first element in viewport.
     * @param  {string} direction   'next' or 'prev'
     * @param  {[type]} pageElement full-screen element selector
     */
    function nearby(direction, pageElement) {
        var targetSection;
        var thisSection = firstInViewport(pageElement);
        switch (direction) {
            case 'next':
                targetSection = thisSection.next(pageElement);
            break;
            case 'prev':
                targetSection = thisSection.prev(pageElement);
            break;
            default:
                targetSection = thisSection;
            break;
        }
        var targetIndex = $(pageElement).index(targetSection);
        if (targetIndex !== -1) {
            $(document).trigger('scroll', targetIndex);
        }
    }

    /**
     * [jumpyScroll description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
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
                onBeforeScroll: function() {},
                onAfterScroll: function(index) {},
                onScroll: function(e, index) {}
            };

            var settings = $.extend({}, defaults, options);

            var top = $(window).scrollTop();
            // var top = window.pageYOffset;
            var animating = false;
            var delay = 300;
            var timeout = null;
            var touchPoint;
            var firstMove = true;
            var navPanel, infoPanel;

            $(settings.pageElement).css('height', '100vh');
            $(settings.pageElement).addClass('animated');
            $(settings.pageElement).css({
                'webkit-animation-duration': settings.speed / 1000 + 's',
                'animation-duration': settings.speed / 1000 + 's'
            });

            navPanel = $('<div />').appendTo($(settings.pageElement).parent()).addClass('jumpyscroll nav');

            /**
             * [if description]
             * @param  {[type]} settings.info [description]
             * @return {[type]}               [description]
             */
            if (settings.info) {
                var pageCount = $(settings.pageElement).length;
                var pageNo = 1;
                infoPanel = $('<div />').appendTo($(settings.pageElement).parent()).addClass('jumpyscroll info');
                $('<span />').appendTo(infoPanel).html(settings.infoText.replace(/\${pageNo}/, pageNo).replace(/\${pageCount}/, pageCount));
            }

            /**
             * [description]
             * @param  {[type]} event) {                           if (event.target.nodeName.toLowerCase() [description]
             * @return {[type]}        [description]
             */
            $(document).on('keydown', function(event) {
                if (event.target.nodeName.toLowerCase() === 'body') {
                    event.preventDefault();
                }
            });

            $(document).on('keyup', function(event) {
                event.preventDefault();
                var targetIndex = -1;
                var targetSection;
                if (settings.keys) {
                    var thisSection = firstInViewport(settings.pageElement);
                    if ([32, 34, 40].indexOf(event.keyCode) >= 0) {
                        targetSection = thisSection.next(settings.pageElement);
                    }
                    if ([33, 38].indexOf(event.keyCode) >= 0) {
                        targetSection = thisSection.prev(settings.pageElement);
                    }
                    if (targetSection !== undefined) {
                        targetIndex = $(settings.pageElement).index(targetSection);
                    }
                    if (targetIndex != -1) {
                        $(document).trigger('scroll', targetIndex);
                    }
                }
            });

            if (settings.nav) {
                var prevButton = $('<div />').appendTo(navPanel).addClass('prev').html(settings.prevLabel);
                var nextButton = $('<div />').appendTo(navPanel).addClass('next').html(settings.nextLabel);

                $(prevButton).on('click touchstart', function(event) {
                    event.preventDefault();
                    nearby('prev', settings.pageElement);
                });

                $(nextButton).on('click touchstart', function(event) {
                    event.preventDefault();
                    nearby('next', settings.pageElement);
                });
            }

            if (settings.dots) {
                var dotsWrapper = $('<div />').appendTo(navPanel).addClass('dots');
                $(settings.pageElement).each(function(index, el) {
                    $('<div />').appendTo(dotsWrapper).addClass('dot');
                });
                var thisSection = firstInViewport(settings.pageElement);
                var targetIndex = $(settings.pageElement).index(thisSection);
                $('.dot.active').removeClass('active');
                $('.dot').eq(targetIndex).addClass('active');
                $(document).on('click touchstart', '.dot', function(event) {
                    event.preventDefault();
                    var targetIndex = $('.dot').index($(this));
                    $(document).trigger('scroll', targetIndex);
                });
            }

            if (settings.touch) {
                document.addEventListener('touchstart', touchStartHandler, false);
                document.addEventListener('touchend', touchEndHandler, false);
            }

            $(document).on('onBeforeScroll', function() {
                settings.onBeforeScroll.call();
            });

            $(document).on('onAfterScroll', function(event, index) {
                settings.onAfterScroll.call();
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
                var thisSection = firstInViewport(settings.pageElement);
                var targetSection;
                var targetIndex = -1;
                if (direction > settings.touchLimit) {
                    targetSection = thisSection.next(settings.pageElement);
                }
                if (direction < -settings.touchLimit) {
                    targetSection = thisSection.prev(settings.pageElement);
                }
                if (targetSection !== undefined) {
                    targetIndex = $(settings.pageElement).index(targetSection);
                }
                if (targetIndex !== -1) {
                    $(document).trigger('scroll', targetIndex);
                }
            }

            // $(document).on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            //     animating = false;
            //     firstMove = true;
            //     $(document).trigger('onAfterScroll');
            // });

            // if(navigator.userAgent.match(/Trident|Edge/i)) {
            //     $(document).on('wheel', function(event) {
            //         event.preventDefault();
            //         var targetIndex = -1;
            //         var targetSection;
            //         var thisSection = firstInViewport(settings.pageElement);
            //         if (event.originalEvent.deltaY > 0) {
            //             targetSection = thisSection.next(settings.pageElement);
            //         }
            //         if (event.originalEvent.deltaY < 0) {
            //             targetSection = thisSection.prev(settings.pageElement);
            //         }
            //         if (targetSection !== undefined) {
            //             targetIndex = $(settings.pageElement).index(targetSection);
            //         }
            //         if (targetIndex !== -1) {
            //             $(document).trigger('scroll', targetIndex);
            //         }
            //     });
            // }

            $(document).on('onwheel mousewheel wheel', function(event) {
                event.preventDefault();
                    var targetIndex = -1;
                    var targetSection;
                    var thisSection = firstInViewport(settings.pageElement);
                    if (event.originalEvent.deltaY > 0) {
                        targetSection = thisSection.next(settings.pageElement);
                    }
                    if (event.originalEvent.deltaY < 0) {
                        targetSection = thisSection.prev(settings.pageElement);
                    }
                    if (targetSection !== undefined) {
                        targetIndex = $(settings.pageElement).index(targetSection);
                    }
                    if (targetIndex !== -1) {
                        $(document).trigger('scroll', targetIndex);
                }
            });

            $(window).on('scroll', function(event, targetIndex) {
                event.preventDefault();
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
                        thisSection.css('opacity', 0);
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
                        $(document).trigger('onBeforeScroll');
                        animating = true;
                        var nextTargetIndex = $(settings.pageElement).index(targetSection);
                        if (settings.dots) {
                            $('.dot.active').removeClass('active');
                            $('.dot').eq(nextTargetIndex).addClass('active');
                        }
                        // $(document).scrollTop(targetSection.position().top);
                        targetSection[0].scrollIntoView(true);
                        top = window.pageYOffset || document.body.scrollTop;
                        $(settings.pageElement).removeClass(settings.animation);
                        targetSection.css('opacity', 1);
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
     * [toIndex description]
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    $.fn.jumpyScroll.toIndex = function(index) {
        $(window).trigger('scroll', index);
    };

    /**
     * [next description]
     * @return {Function} [description]
     */
    $.fn.jumpyScroll.next = function() {
        nearby('next', settings.pageElement);
    };

    /**
     * [prev description]
     * @return {[type]} [description]
     */
    $.fn.jumpyScroll.prev = function() {
        nearby('prev', settings.pageElement);
    };

}(jQuery));
