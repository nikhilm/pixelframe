//(c) 2007 Nikhil Marathe (http://22bits.exofire.net). GNU GPL license.
//@version 0.1
// Implements utility functions for the DOM
// Extends Element
//
// REQUIRES base.js


/**************
 *   DOM   *
 *************/


/**
 * Returns all elements which have the class cName.
 * @param {String} The class name to search for
 * @returns An array of all elements.
*/
function getElementsByClassName(cName) {
    elements = document.getElementsByTagName("*");
    var ret = [];
    $A(elements).each(function(el) { if(el.hasClassName(cName)) ret.push(el); });
    return ret;
}

if (!window.Element) Element = Class.create();
/**
 * Extends the Element class to add certain features.
 * @version 0.1
*/

//store here for use in $()
CustomElement = Class.create();

Object.extend(CustomElement.prototype, {
    /**
     * Removes an element from the DOM.
    */
    remove:function() {
        this.parentNode.removeChild(this);
    },
    /**
     * Returns an array of all the class names of an element.
     * @returns An array of all class names as Strings.
    */
    getClassNames:function() {
        return this.className.split(' ');
    },
    /**
     * Returns the class name if the element has one of its classes as that, otherwise null.
     * @param {String} The class name to check.
     * @returns The class name or null.
    */
    hasClassName:function(cName) {
        return this.getClassNames().join(' ').match("\\b"+cName+"\\b");
    },
    /**
     * Adds a class to the element.
     * @param {String} The class name to add.
    */
    addClass:function(cName) {
        if(!this.hasClassName(cName))
            this.className += ' ' + cName;
        return this;
    },
    /**
     * Removes a class from the element.
     * @param {String} The class name to remove
    */
    removeClass:function(cName) {
        classNm = this.hasClassName(cName);
        if(classNm)
            this.className =this.getClassNames().join(' ').replace(classNm, '');
        return this;
    },
    
    /**
     * Add nodes as child nodes to this Element
    */
    addNodes:function(nodes) {
        __realThis = this;
        nodes.each(function(el) {
            __realThis.appendChild(el);
        });
        return this;
    },
    
    /**
     * Remove nodes from the element
    */
    removeNodes:function(nodes) {
        __realThis = this;
        $A(this.childNodes).each(function(el) {
            if(nodes.indexOf(el))
                __realThis.removeChild(el);
        });
        return this;
    },
    /**
     * Sets the CSS style of an element to all values defined in the object
     * @param {Object} The object containing the style information.
     * Example:element.setStyle({height:500, color:'#00ff00'});
    */
    setStyle:function(style) {
        for(property in style) {
            this.style[property.camelize()] = style[property];
        }
        return this;
    },
    /**
     * Returns the value of the property defined in the element's stylesheet.
     * @param {String} property The CSS property
     * @returns {String} The value of the CSS property
    */
    getStyle:function(property) {
        var ret = this.style[property.camelize()];
        if(!ret) {
            if(document.defaultView && document.defaultView.getComputedStyle) {
                ret = document.defaultView.getComputedStyle(this, null).getPropertyValue(property.camelize());
            }
            else if(element.currentStyle) {
                ret = element.currentStyle[property.camelize()];
            }
        }
        return ret;
    },
    /**
     * Returns the dimensions of the element.
     * Accessible fields are x, y, width, height
    */
    getDimensions:function() {
        var left = this.parentNode.offsetWidth - this.offsetWidth;
        var top = this.parentNode.offsetHeight - this.offsetHeight;
        var w = this.clientWidth;
        var h = this.clientHeight;
        if(this.getStyle('display') == 'none') {
            var originalVisibility = this.visibility;
            var originalPosition = this.position;
            this.visibility = 'hidden';
            this.position = 'absolute';
            this.setStyle({display: ''});
            
            left = this.parentNode.offsetWidth - this.offsetWidth;
            top = this.parentNode.offsetHeight - this.offsetHeight;
            w = this.clientWidth;
            h = this.clientHeight;
            
            this.visibility = originalVisibility;
            this.position = originalPosition;
            this.setStyle({display:'none'});
        }
        return { x:left, y:top, width:w, height:h};
    },
    
    addEvent:function(type, callback, useCapture) {
        Event.push([this, type, callback, useCapture]);
        //try W3C
        if(window.addEventListener) {
            window.addEventListener(type, callback, useCapture);
        }
        //else MS
        else {
            window.attachEvent(type, callback);
        }
    },

    removeEvent:function(type, callback, useCapture) {
        //try W3C
        if(window.addEventListener) {
            window.removeEventListener(type, callback, useCapture);
        }
        //else MS
        else {
            window.detachEvent('on'+type, callback);
        }
    } 
});

//actual extend
Object.extend(Element, CustomElement.prototype);

/**
 * Returns elements having the id passed as a string argument.
 * More than one id can be provided in which case an array of all elements
 * having the corresponding ids is returned
 * @param One or more strings specifying ids.
 * @returns An array or a single element.
*/
function $() {
    if(arguments.length == 1) return getElem(arguments[0]);
    var ret = [];
    $A(arguments).each(
    function (el) {
        ret.push(getElem(el));
    });
    function getElem(el) {
        if (typeof el == 'string' )
            el = document.getElementById(el);
        return ( el ? Object.extend(el, CustomElement.prototype) : false);
    }
    return ret;
}


Event = Class.create();
Object.extend(Event, {
    eventList = false,
    push:function(event) {
        if(!eventList) eventList = [];
        eventList.push(event);
    },
    unloadAll:function() {
        if(!eventList) return;
        $A(eventList).each( function(item) {
            item[0].removeEvent(item[1], item[2], item[3]);
            item[0] = null;
        });
    }
}

$(window).addEvent('unload', Event.unloadAll, false);
