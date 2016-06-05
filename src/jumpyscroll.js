/*
* jumpyScroll - javascript plugin
* copyright 2016, windstarter
* Only for the sale at the envato codecanyon
*/

(function() {

    /**
     * initialize plugin
     * @param  object options user-defined options
     */
    this.jumpyScroll = function(options) {
        var settings = jumpyScroll.settings = jumpyScroll.init(options);
        var top = window.pageYOffset || document.documentElement.scrollTop;
        var animating = false;
        var delay = 300;
        var timeout = null;
        var touchPoint;
        var firstMove = true;
        var navPanel, infoPanel;
        var hash;
        var action = 'hash';
        var sections = document.querySelectorAll(settings.pageElement);
        var animationEndEvents = ['webkitAnimationEnd', 'mozAnimationEnd', 'MSAnimationEnd', 'oanimationend', 'animationend'];
        var wheelEvents = ['onwheel', 'mousewheel', 'wheel'];

        var animationEndHandler = function(animationEndEvent) {
            sections[i].addEventListener(animationEndEvent, function(event) {
                this.classList.remove(settings.animation);
                animating = false;
            });
        };

        var touchStartHandler = function (event) {
            touchPoint = event.changedTouches[event.changedTouches.length - 1];
        };

        var touchMoveHandler = function (event) {
            if (event.changedTouches.length > 0) {
                var direction = touchPoint.clientY - event.changedTouches[event.changedTouches.length - 1].clientY;
                if (Math.abs(direction) > settings.touchLimit) {
                    event.preventDefault();
                }
            }
        };

        var touchEndHandler = function (event) {
            if (event.changedTouches.length > 0) {
                var direction = touchPoint.clientY - event.changedTouches[event.changedTouches.length - 1].clientY;
                if (Math.abs(direction) > settings.touchLimit) {
                    action = event.type;
                    jumpyScroll.toNearby(
                        direction > settings.touchLimit,
                        direction < -settings.touchLimit
                    );
                }
            }
        };

        var wheelEventHandler = function (wheelEvent, event) {
            sections[i].addEventListener(wheelEvent, function(event) {
                event.stopPropagation();
                if (event.ctrlKey === false) {
                    event.preventDefault();
                    action = event.type;
                    jumpyScroll.toNearby(
                        event.deltaY > 0,
                        event.deltaY < 0
                    );
                }
            });
        };

        sections[0].classList.add('active');

        for (var i = 0; i < sections.length; i++) {
            sections[i].classList.add('animated');
            sections[i].style.height = '100vh';
            sections[i].style.overflow = 'hidden';
            sections[i].style.WebkitAnimationDuration = settings.speed / 1000 + 's';
            sections[i].style.animationDuration = settings.speed / 1000 + 's';
            animationEndEvents.forEach(animationEndHandler);
            wheelEvents.forEach(wheelEventHandler);
            if (settings.touch) {
                sections[i].addEventListener('touchstart', touchStartHandler);
                sections[i].addEventListener('touchmove', touchMoveHandler);
                sections[i].addEventListener('touchend', touchEndHandler);
            }
        }

        navPanel = document.createElement('div');
        navPanel.classList.add('jumpyscroll', 'nav');
        sections[0].parentElement.appendChild(navPanel);

        if (settings.info) {
            var pageCount = document.querySelectorAll(settings.pageElement).length;
            var pageNo = 1;
            infoPanel = document.createElement('div');
            infoPanel.classList.add('jumpyscroll', 'info');
            infoPanel.setAttribute('tabindex', '-1');
            infoPanel.innerHTML = '<span>' + settings.infoText.replace(/\${pageNo}/, pageNo).replace(/\${pageCount}/, pageCount) + '</span>';
            document.querySelector(settings.pageElement).parentNode.appendChild(infoPanel);
        }

        if (settings.keys) {

            document.addEventListener('keydown', function(event) {
                if (event.ctrlKey) {
                    return;
                }
                if (event.target.nodeName.toLowerCase() === 'body') {
                    event.preventDefault();
                }
            });

            document.addEventListener('keyup', function(event) {
                event.preventDefault();
                if (event.target.nodeName.toLowerCase() === 'body' && [32, 33, 34, 38, 40].indexOf(event.keyCode) >= 0) {
                    action = event.type;
                    jumpyScroll.toNearby(
                        [32, 34, 40].indexOf(event.keyCode) >= 0,
                        [33, 38].indexOf(event.keyCode) >= 0
                    );
                }
            });
        }

        if (settings.nav) {
            var prevButton = document.createElement('div');
            prevButton.className = 'prev';
            prevButton.innerHTML = settings.prevLabel;
            navPanel.appendChild(prevButton);
            var nextButton = document.createElement('div');
            nextButton.className = 'next';
            nextButton.innerHTML = settings.nextLabel;
            navPanel.appendChild(nextButton);

            navButtonclick = function(event) {
                event.preventDefault();
                action = event.type;
                jumpyScroll.toNearby(this.classList.contains('next'), this.classList.contains('prev'));
            };

            nextButton.addEventListener('click', navButtonclick);
            prevButton.addEventListener('click', navButtonclick);
            nextButton.addEventListener('touchstart', navButtonclick);
            prevButton.addEventListener('touchstart', navButtonclick);
        }

        if (settings.dots) {
            var dotsWrapper = document.createElement('div');
            dotsWrapper.classList.add('dots');
            navPanel.appendChild(dotsWrapper);
            var dot;

            var dotClickHandler = function(event) {
                event.preventDefault();
                action = event.type;
                var index = Array.prototype.indexOf.call(document.querySelectorAll('.dot'), this);
                jumpyScroll.toIndex(index);
            };

            for (i = 0; i < sections.length; i++) {
                dot = document.createElement('div');
                dot.classList.add('dot');
                dot.innerHTML = settings.dotLabel;
                dot.addEventListener('click', dotClickHandler);
                dotsWrapper.appendChild(dot);
            }
            var activedots = document.querySelectorAll('.dot.active');
            for (var j = 0; j < activedots.length; j++) {
                activedots[j].classList.remove('active');
            }
            var dots = document.querySelectorAll('.dot');
            dots[settings.currentIndex].classList.add('active');

            
        }

        hash = window.location.hash;
        window.addEventListener('hashchange', function(event) {
            event.preventDefault();
            action = event.type;
            var hashSection = document.querySelectorAll(settings.pageElement + hash);
            if (hashSection.length > 0) {
                jumpyScroll.toIndex(Array.prototype.indexOf.call(sections, hashSection[0]));
            }
        });

        document.addEventListener('onBeforeScroll', function(event) {
            var index = event.detail.index;
            settings.onBeforeScroll.call(this, index);
        });

        document.addEventListener('onAfterScroll', function(event) {
            var index = event.detail.index;
            settings.onAfterScroll.call(this, index);
            if (settings.info) {
                var pageCount = document.querySelectorAll(settings.pageElement).length;
                document.querySelector('.jumpyscroll.info span').innerHTML = settings.infoText.replace(/\${pageNo}/, ++index).replace(/\${pageCount}/, pageCount);
            }
        });

        window.addEventListener('resize', function(event) {
            event.preventDefault();
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                animating = false;
                action = event.type;
                jumpyScroll.toIndex(settings.currentIndex);
            }, delay);
        });

        window.addEventListener('scroll', function(event) {
            var targetIndex;
            if (event.detail) {
                targetIndex = event.detail.index;    
            }
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
                    targetSection = sections[targetIndex];
                    if (targetIndex !== settings.currentIndex) {
                        var beforeScrollEvent = new CustomEvent('onBeforeScroll', {'detail': {index: targetIndex}});
                        document.dispatchEvent(beforeScrollEvent);
                        animating = true;
                        if (settings.dots) {
                            var dots = document.querySelectorAll('.dot');
                            dots[settings.currentIndex].classList.remove('active');
                            dots[targetIndex].classList.add('active');
                        }
                    }
                    sections[settings.currentIndex].classList.remove('active');
                    targetSection.scrollIntoView(true);
                    top = window.pageYOffset || document.body.scrollTop;
                    targetSection.classList.add('active');
                    if (targetIndex !== settings.currentIndex) {
                        targetSection.classList.add(settings.animation);
                        var afterScrollEvent = new CustomEvent('onAfterScroll', {'detail': {index: targetIndex}});
                        document.dispatchEvent(afterScrollEvent);
                    }
                    settings.currentIndex = targetIndex;
                }, currentDelay);
            }
            if (!animating && (targetIndex === undefined) && (action !== 'hash') && (action !== 'resize')) {
                var thisMoveTop = window.pageYOffset || document.documentElement.scrollTop;
                jumpyScroll.toNearby(
                    thisMoveTop > top,
                    thisMoveTop < top
                );
            }
            if (!animating && action === 'hash' && window.location.hash) {
                var hashSection = document.querySelectorAll(settings.pageElement + window.location.hash);
                if (hashSection.length > 0) {
                    jumpyScroll.toIndex(Array.prototype.indexOf.call(sections, hashSection[0]));
                }
            }
        });
    };


    this.jumpyScroll.init = function(options) {

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
            info: true,
            currentIndex: 0,
            infoText: 'Page ${pageNo} from ${pageCount}',
            onBeforeScroll: function(index) {},
            onAfterScroll: function(index) {},
        };

        // var re;
        // var animateRule = false;
        // var sheets = document.styleSheets;
        // var rules;
        // var i, j;
        // for (i = 0; i < sheets.length; i++) {
        //     rules = sheets[i].cssRules;
        //     for (j = 0; j < rules.length; j++) {
        //         re = new RegExp('^(\.)' + settings.animation + '$');
        //         if (re.test(rules[j].selectorText)) {
        //             animateRule = true;
        //         }
        //     }
        // }
        // if (!animateRule) {
        //     options.animation = 'ease';
        // }
        
        function extend(a, b) {
            result = {};
            for(var key in a) {
                if (b.hasOwnProperty(key)) {
                    result[key] = b[key];
                }
                else
                {
                    result[key] = a[key];
                }
            }
            return result;
        }

        return extend(defaults, options);
    };

    /**
    * fire scroll event with target index parameter
    * @param  boolean conditionNext next element condition
    * @param  boolean conditionPrev previous element condition
    */
    this.jumpyScroll.toNearby = function(conditionNext, conditionPrev) {
        var nearbyIndex = this.settings.currentIndex;
        var sections = document.querySelectorAll(this.settings.pageElement);
        switch (true) {
            case conditionNext:
                nearbyIndex++;
                nearbyIndex = Math.min(nearbyIndex, sections.length - 1);
            break;
            case conditionPrev:
                nearbyIndex--;
                nearbyIndex = Math.max(nearbyIndex, 0);
            break;
        }
        var scrollEvent = new CustomEvent('scroll', {'detail': {index: nearbyIndex}});
        window.dispatchEvent(scrollEvent);
    };

    /**
     * scroll to section by index
     * @param  integer index An integer indicating the position of the element
     */
    this.jumpyScroll.toIndex = function(index) {
        var scrollEvent = new CustomEvent('scroll', {'detail': {index: index}});
        window.dispatchEvent(scrollEvent);
    };

    /**
     * scroll to next section
     */
    this.jumpyScroll.next = function() {
        this.toNearby(true, false);
    };

    /**
     * scroll to previous section
     */
    this.jumpyScroll.prev = function() {
        this.toNearby(false, true);
    };

    if (typeof window.CustomEvent === 'function')
        return false;
    function CustomEvent ( event, params ) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }
    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;

}());