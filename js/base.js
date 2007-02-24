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