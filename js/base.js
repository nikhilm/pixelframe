/**
* Adds a method to easily add properties to an objects prototype.
* To extend Class with properties of AnotherClass just do
* <code>Object.extend(Class.prototype, AnotherClass)</code>
*/
Object.extend = function(dest, src) {
//alert("Copying properties of " + src + " to " + dest);
for(property in src)
dest[property] = src[property];
return dest;
}

/**
* Converts an array type object to an array.
* Eg. arguments array
* @param {Object} The array like object
* @returns An array
*/
function $A(iterable) {
var ret = [];
for(var i = 0; i < iterable.length; i++)
ret.push(iterable[i]);
return ret;
}

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

function $() {
if(arguments.length == 1) return getElem(arguments[0]);
var ret = [];
for(var i = 0; i < arguments.length; ++i)
ret.push(getElem(arguments[i]));
function getElem(el) {
if (typeof el == 'string' )
el = document.getElementById(el);
return el || false;
}
return ret;
}