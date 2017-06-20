$(document).ready(function() {
describe("Try to set up wrong options", function() {
    var properties = {
    	pageElement: '',
     	touch: '',
     	touchLimit: '',
     	keys: '',
     	animation: '',
     	speed: '',
     	nav: '',
     	nextLabel: '',
     	prevLabel: '',
     	dots: '',
     	dotLabel: '',
     	info: '',
     	currentIndex: '',
     	infoText: '',
     	onBeforeScroll: '',
     	onAfterScroll: ''
    };
    var values = [ 
        2,
        'string',
        false,
        { a: 1 },
        function(){}
    ];
    var res;
    var typecast;
    values.forEach(function(element, index) {
        for (var key in properties) {
            properties[key] = element;
        }
        window.jumpyScroll(properties);
        res = window.jumpyScroll.settings;
        Object.keys(res).forEach(function(key) {
        	console.log(properties[key]);
        	if (typeof(res[key]) !== typeof(element)) {
            	typecast = ' option type mismatch, default value (' + res[key] + ') used;';
            }
            else {
	            typecast = '';
            }
        	it('option ' + key + ' value is "' + element + '";' + typecast, function() {
            	window.expect(typeof res[key]).to.equal(typeof res[key]);	
            });
        });
    });
});

describe("pageElement was found in document", function() {
	it("pageElement exist", function() {
    	var res = window.jumpyScroll.init({info: false});
        expect($(res.pageElement).length > 0).to.equal(true);
    });
});

describe("Go to pageElement by its index", function() {
	it("element 0 has class first", function() {
   		window.jumpyScroll({
   			onAfterScroll: function(index) {
    			var res = window.jumpyScroll.settings;
    		    expect($(res.pageElement).eq(res.currentIndex).hasClass('first')).to.equal(true);        
            },
            info: false
   		});
    	window.jumpyScroll.toIndex(0);
    });
    it("element 1 has class second", function() {
   		window.jumpyScroll({
   			onAfterScroll: function(index) {
    			var res = window.jumpyScroll.settings;
    		    expect($(res.pageElement).eq(res.currentIndex).hasClass('second')).to.equal(true);        
            },
            info: false
   		});
    	jumpyScroll.toIndex(1);
    });
    it("element 2 has class third", function() {
   		window.jumpyScroll({
   			onAfterScroll: function(index) {
    			var res = window.jumpyScroll.settings;
    		    expect($(res.pageElement).eq(res.currentIndex).hasClass('third')).to.equal(true);        
            },
            info: false
   		});
    	window.jumpyScroll.toIndex(2);
    });
});


describe("Go to next pageElement", function() {
	it("element after second has class third", function() {
		window.jumpyScroll({
			onAfterScroll: function(index) {
    			var res = window.jumpyScroll.settings;
    		    expect($(res.pageElement).eq(res.currentIndex).hasClass('third')).to.equal(true);        
	        },
	        info: false
		});
		jumpyScroll.toIndex(1);
		jumpyScroll.next();
    });
});

describe("Go to previous pageElement", function() {
	it("element before second has class first", function() {
		window.jumpyScroll({
			onAfterScroll: function(index) {
    			var res = window.jumpyScroll.settings;
    		    expect($(res.pageElement).eq(res.currentIndex).hasClass('first')).to.equal(true);        
	        },
	        info: false
		});
		window.jumpyScroll.toIndex(1);
		window.jumpyScroll.prev();
    });
});

describe("Scroll up or down", function() {
	it("Scroll up", function() {
		window.jumpyScroll({
			onAfterScroll: function(index) {
    			var res = window.jumpyScroll.settings;
    		    expect($(res.pageElement).eq(res.currentIndex).hasClass('first')).to.equal(true);        
	        },
	        info: false
		});
		window.jumpyScroll.toIndex(1);
		window.jumpyScroll.toNearby(false, true);
    });
    it("Scroll down", function() {
		window.jumpyScroll({
			onAfterScroll: function(index) {
    			var res = window.jumpyScroll.settings;
    		    expect($(res.pageElement).eq(res.currentIndex).hasClass('third')).to.equal(true);        
	        },
	        info: false
		});
		window.jumpyScroll.toIndex(1);
		window.jumpyScroll.toNearby(true, false);
    });
});

setTimeout(function() {
    var sections = document.querySelectorAll('section');
    for (var i = 0; i < sections.length; i++) {
        sections[i].parentNode.removeChild(sections[i]);
      }
  }, 1500);

});