//(c) 2007 Nikhil Marathe (http://22bits.exofire.net). GNU GPL license.
//@version 0.1

/***********************************
 *      INBUILT OBJECT EXTENSIONS  *
 **********************************/
/**
 * Adds certain extra features to arrays
 * @version 0.1
*/
_ArrayExtension = {
    /**
     * Calls a specified function for each element in the array.
     * The function is passed the current array element as the first argument.
     * Example:
     * <code>[1, 2, 3, 4, 5].each(function(num) { sqr = num * num; });</code>
     * @param {Function} The function to call for each element.
    */
    each:function(func) {
        for(var i = 0; i < this.length;i++)
            func(this[i]);
    },
    
    /**
     * @returns the last array element
    */
    last:function() { return this[this.length - 1]; },
    
    /**
     * Checks if a value is in the array.
     * Returns the position if found, otherwise -1.
     * <code>[1, 2, 3].indexOf(2) -> 1</code>
     * @param {Object} The object to check.
     * @returns the index if found or -1.
    */
    indexOf: function(object) {
        for(var i = 0; i < this.length; i++)
            if(object == this[i]) return i;
        return -1;
    }
    
}

Object.extend(Array.prototype, _ArrayExtension);

/**
 * Extends Number.
 * @version 0.1
*/
_NumExtension = {
    /**
     * Adds ruby style looping simplicity.
     * To do something <i>n</i> times do.
     * <code>(5).times(function() { doSomething; })</code>
     * The function is also passed the ith element.
     * @params {Function} The function to be called each time
    */
    times:function(func) {
        if(this <= 0) return;
        for(var i = 1; i <= this; i++)
            func();
    },
    /**
     * Returns a string representation of the number for use in colours.
    */
    toColourPart:function() {
        if(this<=255)return this.toHex();
    },
    /**
     * Returns the value of the number converted to hexadecimal
     * @returns A string.
    */
    toHex:function() {
        var hexDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8'
			, '9', 'a', 'b', 'c', 'd', 'e', 'f'];
        var hex_r = this % 16;
        var hex_q = (this-hex_r)/16;
        return hexDigits[hex_q] + hexDigits[hex_r];
    }
}
Object.extend(Number.prototype, _NumExtension)

Object.extend(String.prototype, {
    /**
     * Use to convert CSS '-' seperated properties to the camelCased javascript version.
     * @returns The camelCased string
    */
    camelize:function() {
        var ar = this.split('-');
        var ret = ar[0];
        for(var i = 1; i < ar.length; i++)
            ret+=ar[i].charAt(0).toUpperCase() + ar[i].substring(1);
        return ret;
    },
    
    _Dec:function() {
        var hexDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8'
			, '9', 'a', 'b', 'c', 'd', 'e', 'f'];
        var ret = 0;
        for(var i = 0; i < this.length; ++i) {
            ret = ret * 16 + hexDigits.indexOf(this.charAt(i).toLowerCase());
        }
        return ret;
    },
    /**
     * Returns the hexadecimal colour code from the String.
     * Use this to parse CSS colours retrieved using Element.getStyle
     * because it handles RGB and converts it to hex.
     * @returns A string representing the colour
    */
    HEX:function() {
        var ret = '#';
        if(this.substr(0, 4) == 'rgb(') {
            colours = this.RGB();
            [colours.r, colours.g, colours.b].each(function(col) { ret += col.toColourPart(); });
        }
        else if(this.charAt(0) == '#') {
            if(this.length == 4) {
                sub = this.substring(1);
                ret += sub + sub;
            }
            else
                ret  = this;
        }
        return (ret == '#' ? null:ret);
    },
    
    /**
     * Returns an RGB object with members
     * r, g, and b
    */
    RGB:function() {
        var rgb = {
            r:0,
            g:0,
            b:0
        };
        if(this.substr(0, 4) == 'rgb(') {
            colours = this.substring(4, this.length-1).split(',');
            rgb.r = parseInt(colours[0]);
            rgb.g = parseInt(colours[1]);
            rgb.b = parseInt(colours[2]);
        }
        else if(this.charAt(0) == '#') {
            //get a valid hex string
            var hex = this.HEX();
            //dump the #
            hex = hex.substring(1);
            rgb.r = hex.substring(0, 2)._Dec();
            rgb.g = hex.substring(2, 4)._Dec();
            rgb.b = hex.substring(4)._Dec();
        }
        return rgb;
    }
});
