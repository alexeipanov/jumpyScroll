jumpyScroll javascript plugin

- for quick document scroll with animation

Thank you for purchasing my plugin. If you have any questions that are beyond the scope of this help file, please feel free to email via my user page [contact form here](http://codecanyon.net/user/windstarter). Thanks so much!

<span id="anchor"></span>Overview

<span id="anchor-1"></span>Features
-----------------------------------

-   scroll with touch navigation, keyboard, mouse wheel, scrollbar, hash navigation, with buttons to next and previous sections, and dot buttons for any section;
-   animated scroll effect - more 80 animation effects included (5 basic css animations, 75 advanced animations with [Animate.css](http://daneden.github.io/animate.css/), and custom animation example);
-   CSS animation-driven (hardware accelerated);
-   customizable animations;
-   customizable UI - buttons, dots, messages;
-   custom events;
-   well documented;
-   pure javascript - no jQuery required;

<span id="anchor-2"></span>Requirements
---------------------------------------

-   (optional) [Animate.css](http://daneden.github.io/animate.css/)

<span id="anchor-3"></span>Installation
---------------------------------------

### <span id="anchor-4"></span>Include CSS

&lt;link rel="stylesheet" href="jumpyscroll.css"&gt;

### <span id="anchor-5"></span>Include JS

&lt;script src="jumpyscroll.min.js"&gt;&lt;/script&gt;

### <span id="anchor-6"></span>Set HTML sections

&lt;body&gt;

 ...

 &lt;section&gt;

 page one

 &lt;/section&gt;

 &lt;section&gt;

 page two

 &lt;/section&gt;

 &lt;section&gt;

 page ..

 &lt;/section&gt;

 ...

&lt;/body&gt;

### <span id="anchor-7"></span>Call the plugin

$(document).ready(function(){

 window.jumpyscroll();

});

Options

<span id="anchor-8"></span>pageElement
--------------------------------------

Html elements selector to be scroll
default value: 'section'

<span id="anchor-9"></span>animation
------------------------------------

Animation that should be applied to the *pageElement* after scroll.
Available values: 'ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out'
If [animate.css](http://daneden.github.io/animate.css/) is used, additional animations from this library are avaliable,
i. e.: 'zoomIn'
default value: 'ease'
Example:

$(document).ready(function() {

 window.jumpyScroll({

 animation: 'jello'

 });

});

Custom animation:

### CSS

@-webkit-keyframes ufo {

 from {

 transform: scale3d(0, 0, 0) translate3d(500px, -500px, 0px);

 }

}

@keyframes ufo {

 from {

 transform: scale3d(0, 0, 0) translate3d(500px, -500px, 0px);

 }

}

.ufo {

 -webkit-animation-name: ufo;

 animation-name: ufo;

 -webkit-animation-timing-function: cubic-bezier(1,.4,.3,1);

 animation-timing-function: cubic-bezier(1,.4,.3,1);

}

### JS

$(document).ready(function() {

 window.jumpyScroll({

 animation: 'ufo',

 });

});

<span id="anchor-10"></span>speed
---------------------------------

Animation speed, milliseconds
default value: 500

<span id="anchor-11"></span>touch
---------------------------------

Enable touch swipes on touch-devices
default value: true

<span id="anchor-12"></span>touchLimit
--------------------------------------

Length in pixel the user needs to swipe for jump to the next (previous) *pageElement*
default value: 5

<span id="anchor-13"></span>keys
--------------------------------

Enable keyboard navigation (arrow up / down, Page Up / Page Down, space)
default value: true

<span id="anchor-14"></span>nav
-------------------------------

Display buttons for next and previous action
default value: true

<span id="anchor-15"></span>nextLabel
-------------------------------------

Text or HTML code for the next button
default value:

<span id="anchor-16"></span>prevLabel
-------------------------------------

Text or HTML code for the previous button
default value:

<span id="anchor-17"></span>dots
--------------------------------

Dot markers for quick navigation to every *pageElement*
default value: true

<span id="anchor-18"></span>dotLabel
------------------------------------

Text or HTML code for dot marker
default value: -

Example - Using FontAwesome

### CSS

.jumpyscroll.nav .prev {

 background-image: none;

 display: flex;

}

.jumpyscroll.nav .next {

 background-image: none;

 display: flex;

}

.jumpyscroll.nav .next i, .jumpyscroll.nav .prev i {

 margin: auto;

}

.jumpyscroll .dot {

 cursor: pointer;

 background-image: none;

 opacity: 0.5;

}

.jumpyscroll .dot.active {

 opacity: 1;

}

### JS

$(document).ready(function() {

 window.jumpyScroll({

 prevLabel: '&lt;i class="fa fa-chevron-up"&gt;&lt;/i&gt;',

 nextLabel: '&lt;i class="fa fa-chevron-down"&gt;&lt;/i&gt;',

 dotLabel: '&lt;i class="fa fa-circle"&gt;&lt;/i&gt;',

 });

});

Example - Dots with numbers

### CSS

.jumpyscroll .dots {

 counter-reset: dn;

}

.jumpyscroll .dot {

 width: 2em;

 height: 2em;

 background-image: none;

 background-color: white;

}

.jumpyscroll .dots div {

 margin: auto;

}

.jumpyscroll .dot div:before {

 content: counter(dn);

 counter-increment: dn;

 color: black;

 font-weight: 900;

}

### JS

$(document).ready(function() {

 window.jumpyScroll({

 dotLabel: '&lt;div&gt;&lt;/div&gt;',

 });

});

<span id="anchor-19"></span>info
--------------------------------

Display info panel with current *pageElement* number and custom messages
default value: true

<span id="anchor-20"></span>infoText
------------------------------------

Info panel text pattern
default value: 'Page ${pageNo} from ${pageCount}'

<span id="anchor-21"></span>onBeforeScroll
------------------------------------------

custom function to call before scroll
parameters: index - zero-based *pageElement* index on which will be jumped
default value: function(index) {}
example:

function(index) {

 var animations = \[

 'bounce',

 'flash',

 'pulse',

 'shake',

 'jello',

 'bounceIn',

 'fadeIn'

 \];

 var rand = Math.floor(Math.random() \* animations.length);

 jumpyScroll.settings.animation = animations\[rand\];

}

<span id="anchor-22"></span>onAfterScroll
-----------------------------------------

custom function to call after scroll
parameters: index - zero-based *pageElement* index on which will be jumped
default value: function(index) {}
example:

function(index) {

 switch (index) {

 case 2:

 jumpyScroll.settings.infoText = 'This is &lt;strong&gt;third&lt;/strong&gt; page!';

 break;

 default:

 jumpyScroll.settings.infoText = 'Page ${pageNo} from ${pageCount}';

 break;

 }

}

Styles

As an example, plugin adds some elements to page (depend by options):

&lt;div class="jumpyscroll nav"&gt;

 &lt;div class="prev"&gt;&lt;/div&gt;

 &lt;div class="next"&gt;&lt;/div&gt;

 &lt;div class="dots"&gt;

 &lt;div class="dot"&gt;&lt;/div&gt;

 &lt;div class="dot active"&gt;&lt;/div&gt;

 &lt;div class="dot"&gt;&lt;/div&gt;

 &lt;/div&gt;

&lt;/div&gt;

&lt;div class="jumpyscroll info"&gt;

 &lt;span&gt;Page 2 from 3&lt;/span&gt;

&lt;/div&gt;

With these classes, you may configure it as needed. This classes declared in jumpyscroll.css

<span id="anchor-23"></span>navWrapper class
--------------------------------------------

Wrapper class for nav buttons and dots
default value: .jumpyscroll .nav

<span id="anchor-24"></span>prev class
--------------------------------------

Prev button class
default value: .prev

<span id="anchor-25"></span>next class
--------------------------------------

Next button class
default value: .next

<span id="anchor-26"></span>dots wrapper class
----------------------------------------------

Wrapper class for dots navigation
default value: .dots

<span id="anchor-27"></span>dot class
-------------------------------------

Dot button class
default value: .dot

<span id="anchor-28"></span>active dot class
--------------------------------------------

Active dot button class
default value: .active

<span id="anchor-29"></span>info wrapper class
----------------------------------------------

Wrapper class for info panel
default value: .jumpyscroll .info

Methods

<span id="anchor-30"></span>jumpyScroll.next()
----------------------------------------------

Jump to next *pageElement*
parameters: none

example:

$('a.nextbutton').on('click', function(event) {

 event.preventDefault();

 window.jumpyScroll.next();

});

<span id="anchor-31"></span>jumpyScroll.prev()
----------------------------------------------

Jump to previous *pageElement*
parameters: none

example:

$('a.prevbutton').on('click', function(event) {

 event.preventDefault();

 window.jumpyScroll.prev();

});

<span id="anchor-32"></span>jumpyScroll.toIndex()
-------------------------------------------------

Jump to *pageElement* by its index (zero-based)
parameters: index

example - jump to the third *pageElement*:

$('a.tosomesection').on('click', function(event) {

 event.preventDefault();

 window.jumpyScroll.toIndex(2);

});
