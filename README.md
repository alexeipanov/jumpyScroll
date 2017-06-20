# jumpyScroll javascript plugin
quick document scroll with animation
-----------------------------------

## Features

-   scroll with touch navigation, keyboard, mouse wheel, scrollbar, hash navigation, with buttons to next and previous sections, and dot buttons for any section;
-   animated scroll effect - more 80 animation effects included (5 basic css animations, 75 advanced animations with [Animate.css](http://daneden.github.io/animate.css/), and custom animation example);
-   CSS animation-driven (hardware accelerated);
-   customizable animations;
-   customizable UI - buttons, dots, messages;
-   custom events;
-   well documented;
-   pure javascript - no jQuery required;

##  Demo
    [Options](http://plugins.windstarter.me/jumpyscroll/demos/demo/)
    [Animations](http://plugins.windstarter.me/jumpyscroll/demos/animation/)
    [Events](http://plugins.windstarter.me/jumpyscroll/demos/events/)

## Requirements
-   (optional) [Animate.css](http://daneden.github.io/animate.css/)

## Installation

### Include CSS

```<link rel="stylesheet" href="jumpyscroll.css">```

### Include JS

```<script src="jumpyscroll.min.js"></script>```

### Set HTML sections
```    
<body>
    ...
    <section>
        page one
    <section>
    <section>
        page two
    </section>
    <section>
        page ..
    </section>
    ...
</body>
```

### Call the plugin
```    
$(document).ready(function(){
    window.jumpyscroll();
});
```

## Options

### pageElement

Html elements selector to be scroll

default value: ```section```

-----------------------------------

### animation

Animation that should be applied to the *pageElement* after scroll.
Available values: 'ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out'
If [animate.css](http://daneden.github.io/animate.css/) is used, additional animations from this library are avaliable

default value: ```ease```

Example:

**JS**
```    
$(document).ready(function() {
  window.jumpyScroll({
    animation: 'jello'
  });
});
```
Custom animation example:

** CSS**
```     
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
```
**JS**
```    
$(document).ready(function() {
  window.jumpyScroll({
    animation: 'ufo',
  });
});
```
---------------------------------

### speed

Animation speed, milliseconds

default value: ```500```

---------------------------------

### touch

Enable touch swipes on touch-devices

default value: ```true```

---------------------------------

### touchLimit

Length in pixel the user needs to swipe for jump to the next (previous) *pageElement*

default value: ```5```

---------------------------------

### keys


Enable keyboard navigation (arrow up / down, Page Up / Page Down, space)

default value: ```true```

---------------------------------

### nav

Display buttons for next and previous action

default value: ```true```

---------------------------------

### nextLabel

Text or HTML code for the next button

default value: none

-------------------------------------

### prevLabel

Text or HTML code for the previous button

default value: none

-------------------------------------

### dots

Dot markers for quick navigation to every *pageElement*

default value: ```true```

-------------------------------------

### dotLabel

Text or HTML code for dot marker

default value: none

**CSS**
```
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
```

**JS**
```
$(document).ready(function() {
    window.jumpyScroll({
        prevLabel: '<i class="fa fa-chevron-up"></i>',
        nextLabel: '<i class="fa fa-chevron-down"></i>',
        dotLabel: '<i class="fa fa-circle"></i>',
    });
});
```

**CSS**
```
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
```
**JS**
```
$(document).ready(function() {
        window.jumpyScroll({
        dotLabel: '<div></div>'
    });
});
```
-------------------------------------

### info

Display info panel with current *pageElement* number and custom messages

default value: ```true```

-------------------------------------

### infoText

Info panel text pattern

default value: ```Page ${pageNo} from ${pageCount}```

-------------------------------------

### onBeforeScroll

custom function to call before scroll
parameters: index - zero-based *pageElement* index on which will be jumped

default value: ```function(index) {}```

example:
```
function(index) {
    var animations = [
        'bounce',
        'flash',
        'pulse',
        'shake',
        'jello',
        'bounceIn',
        'fadeIn'
    ];

    var rand = Math.floor(Math.random() * animations.length);
    jumpyScroll.settings.animation = animations[rand];
}
```
-------------------------------------

### onAfterScroll

custom function to call after scroll
parameters: index - zero-based *pageElement* index on which will be jumped

default value: ```function(index) {}```

example:
```
function(index) {
    switch (index) {
        case 2:
        jumpyScroll.settings.infoText = 'This is <strong>third</strong> page!';
        break;
        default:
        jumpyScroll.settings.infoText = 'Page ${pageNo} from ${pageCount}';
        break;
    }
}
```
-------------------------------------

## Styles

As an example, plugin adds some elements to page (depend by options):
```
<div class="jumpyscroll nav">
    <div class="prev"></div>
    <div class="next"></div>
    <div class="dots">
        <div class="dot"></div>
        <div class="dot active"></div>
        <div class="dot"></div>
    </div>
</div>

<div class="jumpyscroll info">
    <span>Page 2 from 3</span>
</div>
```
With these classes, you may configure it as needed. This classes declared in jumpyscroll.css

### navWrapper class

Wrapper class for nav buttons and dots

default value: ```.jumpyscroll .nav```

-------------------------------------

### prev class

Prev button class

default value: ```.prev```

-------------------------------------

### next class

Next button class

default value: ```.next```

-------------------------------------

### dots wrapper class

Wrapper class for dots navigation

default value: ```.dots```

-------------------------------------

### dot class

Dot button class

default value: ```.dot```

-------------------------------------

### active dot class

Active dot button class

default value: ```.active```

-------------------------------------

info wrapper class

Wrapper class for info panel

default value: ```.jumpyscroll .info```

-------------------------------------

## Methods

### jumpyScroll.next()

Jump to next *pageElement*

parameters: none

example:
```
$('a.nextbutton').on('click', function(event) {
    event.preventDefault();
    window.jumpyScroll.next();
});
```
-------------------------------------

### jumpyScroll.prev()

Jump to previous *pageElement*

parameters: none

example:
```
$('a.prevbutton').on('click', function(event) {
    event.preventDefault();
    window.jumpyScroll.prev();
});
```
-------------------------------------

### jumpyScroll.toIndex()

Jump to *pageElement* by its index (zero-based)

parameters: index

example - jump to the third *pageElement*:
```
$('a.tosomesection').on('click', function(event) {
    event.preventDefault();
    window.jumpyScroll.toIndex(2);
});
```
