//(c) 2007 Nikhil Marathe (http://22bits.exofire.net). GNU GPL license.
//@version 0.1
// Implements various effects.
// REQUIRES base.js, dom.js
/**
 * effects.js implements all of Juice's effects.
 * 
 * Note: All core effects need to be instantiated with new. Combination effects may or may not use new.
 *
 * The first argument to all effects is the element id as a string or the element itself on which the effect is to be performed.
 *
 * All effects accept the following arguments wrapped in a object
 * as their last argument:
 * - duration The number of milliseconds for which the effect lasts Default:1000
 * - fps The frames per second Default:50
 * - transition The ease in/out transition method. A function from Effects.Transitions Default:Effects.Transitions.sinusoidal
*/



Effects = Class.create();

/**
 * Defines transitions which can be used by all effects.
 * See effects documentation for usage.
*/
Effects.Transitions = {
    //all functions have declaration (time, begin, change, duration)
    linear:function(t, b, c, d) { return (c*t/d + b); },
    sinusoidal:function(t, b, c, d) { return c/2 * (1 - Math.cos(Math.PI*t/d)) + b; },
    quadratic:function(t, b, c, d) { return c*(t/=d)*t + b; }
};

/**
 * The base class for all effects it handles timekeeping, handling options, and other core stuff.
 * You should inherit from this class to create your own effects.
*/
Effects.Base = function() {};
Object.extend(Effects.Base.prototype, {
    effectDone:false,
    setOptions:function(options) {
        this.options = Object.extend({
            onStart:function() {},
            onComplete:function() {},
            duration: 1000,
            fps:50,
            transition:Effects.Transitions.sinusoidal
        }, options);
    },
    _step:function(){
        var time = new Date().getTime();
        if(time <= this.startTime + this.options.duration) {
            this.elapsedTime = time - this.startTime;
            this._setNow();
        }
        else {
            setTimeout(this.options.onComplete.bind(this.element), 10);
            this._resetTimer();
            this.startTime = 0;
        }
        this.update();
    },
    activate:function(from, to) {
        return this._start(from, to);
    },
    _start:function(from, to) {
        if(this.timer) return;
        setTimeout(this.options.onStart.bind(this.element), 10);
        
        this.from = from;
        this.to = to;
        this.startTime = new Date().getTime();
        this.timer = setInterval(this._step.bind(this), Math.round(1000/this.options.fps));
        
        
        return this;
    },
    _setNow:function() {
        this.now =  this.compute(this.from, this.to);
    },
    compute:function(from, to) {
        return this.options.transition(this.elapsedTime, from, to-from, this.options.duration);
    },
    _resetTimer: function() {
        clearInterval(this.timer);
        this.timer = null;
    },
    /**
     * Toggles the current effect
    */
    toggle:function() {
        this._resetTimer();
        this.activate(this.to, this.from);
    }
});

/**
 * Used for effects which have to modify multiple properties
*/
Effects.Multiple = function() {};
Object.extend(Object.extend(Effects.Multiple.prototype, new Effects.Base()), {
    activate:function(from, to) {
        frm = {};
        Object.extend(frm, from);
        //for(p in frm)alert(p + " = " + frm[p]);
        t = {};
        Object.extend(t, to);
        //for(p in t) alert(p + " = " + t[p]);
        this.now = {};
        this._start(frm, t);
    },
    _setNow:function() {        
        for(p in this.from) {
            var result = this.compute(this.from[p], this.to[p]);
            this.now[p] = result;
        }
    }
});

/**
 * Moves the element to the position specified
 * Example: new Effects.Move('element', {x:100, y:250});
*/
Effects.Move = Class.create();
Object.extend(Object.extend(Effects.Move.prototype, new Effects.Multiple()), {
    initialize:function(el) {
        //alert("Effects.Move constructer called");
        this.element = $(el);
        this.setOptions(arguments[1]);
        oLeft = parseFloat(this.element.getStyle('left') || this.element.offsetLeft);
        oTop  = parseFloat(this.element.getStyle('top')  || this.element.offsetTop);
        if(this.options.mode == 'absolute') {
            this.options.x = this.options.x - oLeft;
            this.options.y = this.options.y - oTop;
        }
        this.now = {};
        this.activate({x:oLeft, y:oTop}, {x:this.options.x, y:this.options.y});
    },
    update:function() {
        //alert("Updating");
        this.element.setStyle({
            left: Math.round(this.now['x']),
            top: Math.round(this.now['y'])
        });
    }
});

function _restoreSize(elem, w, h) {
   $(elem).setStyle({width:w+"px", height:h+"px"});
} 

/**
 * Sets the width of the element.
 * Accepts additional argument restore:true/false which restores original size after effect
 * Example: new Effects.Width('width', {width:500});
*/
Effects.Width = Class.create();
Object.extend(Object.extend(Effects.Width.prototype, new Effects.Base()), {
    initialize:function(el) {
        this.element = $(el);
        this.setOptions(arguments[1]); 
        this.element.setStyle({overflow:'hidden'});       
        
        if(this.options.restoreSize) {
            w = this.element.getDimensions().width;
            h = this.element.getDimensions().height;        
            this.options.onComplete = function() { _restoreSize(this, w, h);};
        }


        this.activate(parseInt((this.element.getStyle('width')||this.element.offsetWidth)), this.options.width);
    },    
    update:function() {
        console.log(this.now);
        this.element.setStyle({
            width:Math.round(this.now)+"px"
        });
    }
});

/**
 * Sets the height of the element.
 * Accepts additional argument restore:true/false which restores original size after effect
 * Example: new Effects.Width('height', {width:50});
*/
Effects.Height = Class.create();
Object.extend(Object.extend(Effects.Height.prototype, new Effects.Base()), {
    initialize:function(el) {
        this.element = $(el);
        this.setOptions(arguments[1]);
        this.element.setStyle({overflow:'hidden'});

        if(this.options.restoreSize) {
            w = this.element.getDimensions().width;
            h = this.element.getDimensions().height;        
            this.options.onComplete = function() { _restoreSize(this, w, h); };
        }


        this.activate(parseInt((this.element.getStyle('height')||this.element.offsetHeight)), this.options.height);
    },
    update:function() {
        this.element.setStyle({
            height:Math.round(this.now)+"px"
        });
    }
});

/**
 * Sets the opacity of the element to the value specified.
 * It also works on images.
 * Note: opacity should be between 0.0 and 1.0 inclusive
 * Example: new Effects.Opacity('opacity', {opacity:0.5});
*/
Effects.Opacity = Class.create();
Object.extend(Object.extend(Effects.Opacity.prototype, new Effects.Base()), {
    initialize:function(el) {
        this.element = $(el);
        this.setOptions(arguments[1]);
        this.activate(parseFloat(this.element.getStyle('opacity')||'1.0'), this.options.opacity||0.0);
    },
    update:function() {
        this.element.setStyle( { opacity:this.now,  filter:'alpha(opacity=' + this.now*20 + ')' });
    }
});

/**
 * Transitions from startColour (Default #000) to endColour (Default #fff).
 * The second argument is the style sheet property.
 * Example: new Effects.Colour('colourslide', 'background-color', {startColour:'#f0f', endColour:'#999'});
*/
Effects.Colour = Class.create();
Object.extend(Object.extend(Effects.Colour.prototype, new Effects.Multiple()), {
    initialize:function(el, style) {
        this.element = $(el);
        this.style = style;
        this.setOptions(Object.extend({
            startColour:'#000',
            endColour:'#fff',
            duration:2000
        }, arguments[2]));
        
        var startColour = this.options.startColour.RGB();
        var endColour = this.options.endColour.RGB();
        this.activate(startColour, endColour);
    },
    update:function() {
        var colour = '#';
        for (val in this.now) {
            colour += Math.ceil(this.now[val]).toHex();;
        }
        eval('this.element.setStyle({'+this.style.camelize()+':\''+colour+'\'})');
        //this.element.setStyle({background:colour});
    }
});

/**
 * Modifies any numerical CSS property.
 * Effects.Customs call is slightly long like so
 * Example: new Effects.Custom('element', 'border-width', 10, 50);
*/
Effects.Custom = Class.create();
Object.extend(Object.extend(Effects.Custom.prototype, new Effects.Base()), {
    initialize:function(el, style, start, end) {
        this.element = $(el);
        this.style = style;
        this.setOptions(Object.extend({units:'px'}, arguments[4]));
        this.element.setStyle({style:start+'px'});
        this.activate(start, end);
    },
    update:function() {
        //setStyle accepts as variable and not string, so just eval the whole expression
        eval('this.element.setStyle({'+this.style.camelize()+':Math.ceil('+this.now+')+\''+this.options.units+'\'})');
    }
});


/*********************************
 * COMBINATION EFFECTS  *
 ******************************/

/**
 * The yellow fade effect
*/
Effects.Highlight = function(el) {
    new Effects.Colour(el, 'background-color', Object.extend(arguments[1]||{}, {
        startColour:'#FFE373',
        endColour:$(el).getStyle('background-color')||'#fff'
    }));
}

/**
 * Creates and appearing effect by going from opacity 0 to 1
*/
Effects.Appear = function(el) {
    element = $(el);
    element.setStyle({opacity:0});
    new Effects.Opacity(element, Object.extend({opacity:1.0}, arguments[1]));
}

/**
 * Fade effect
*/
Effects.Fade = function(el) {
    element = $(el);
    element.setStyle({opacity:1.0});
    new Effects.Opacity(element, Object.extend({ opacity:0}, arguments[1]));
}

/**
 * Shrinks the element's size to 0, 0.
*/
Effects.Shrink = function(el) {
    new Effects.Width(el, Object.extend({width:0}, this.options));
    new Effects.Height(el, Object.extend({height:0}, this.options));
}

/**
 * Creates a Blind effect by opening the element up
*/
Effects.BlindDown = function(el) {
    $(el).setStyle({overflow:'hidden'});
    var ht = $(el).getDimensions().height;
    $(el).setStyle({height:0});
    new Effects.Height(el, Object.extend({height:ht}, arguments[1]));
}

/**
 * The reverse of Effects.BlindDown. Closes the element.
*/
Effects.BlindUp = function(el) {
    $(el).setStyle({overflow:'hidden'});
    new Effects.Height(el, Object.extend({height:0}, arguments[1]));
}

/**
 * Slides in the element towards its left edge.
*/
Effects.SlideIn = function(el) {
    $(el).setStyle({overflow:'hidden'});
    new Effects.Width(el, Object.extend({width:0}, arguments[1]));
}

/**
 * The reverse of Effects.SlideIn.
*/
Effects.SlideOut = function(el) {
    $(el).setStyle({overflow:'hidden'});
    var wt = $(el).getDimensions().width;
    $(el).setStyle({width:0});
    new Effects.Width(el, Object.extend({width:wt}, arguments[1]));
}

/**
 * Moves the element down a bit and quickly fades it creating the illusion of a drop.
 * IMPORTANT: The element is REMOVED from the DOM on completion of the effect.
*/
Effects.Drop = function(el) {
    new Effects.Move(el, {y:100, duration:200, onComplete:function() { this.remove() }});
    new Effects.Fade(el, {duration:150});
}

