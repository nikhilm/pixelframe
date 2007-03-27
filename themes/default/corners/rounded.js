// Copyright Nikhil Marathe (2007) nsm.nikhil@gmail.com
// GNU GPL 2.0
function $() {
    if(arguments.length == 1) return getElem(arguments[0]);
    var ret = [];
    for(var i = 0; i < arguments.length; i++)
            ret.push(getElem(arguments[i]));
    
    function getElem(el) {
        if (typeof el == 'string' )
            el = document.getElementById(el);
        return ( el ? el : false);
    }
    return ret;
}

function hasClassName(elem, name) {
    if(elem.className)
        return elem.className.match("\\b"+name+"\\b");
    else
        return false;
}

function getElementsByClassName(cName) {
    elements = document.body.getElementsByTagName("*");
    //console.log(elements);
    var ret = [];
    for(var i = 0; i < elements.length;i++) {
        if(hasClassName(elements[i], cName))
            ret.push(elements[i]);
    }
    
    return ret;
}

/*
* Accepts the element to round and the corners to round
* Valid values for the second argument are {top:true/false, bottom:true/false]
*/
function roundCorners(elem) {
    var ar = ['corner_tl', 'corner_tr', 'corner_bl', 'corner_br'];
    //create the appropriate div elements
    var nodes = [];        
    for(i = 0; i < ar.length; i++) {
        nodes.push(document.createElement('div'));
        nodes[i].className = ar[i];
    }
    
    var validCorners = []
    if(!arguments[1]) {
        a = ['tl', 'tr', 'bl', 'br']
        for(var i = 0; i < a.length; i++)
            validCorners[a[i]] = true;
    }
    else {
        for(prop in arguments[1])
            validCorners[prop] = arguments[1][prop];
    }
    
    if(validCorners['tl'] ) {
        elem.insertBefore(nodes[0], elem.firstChild);
    }
    if(validCorners['tr']) {
        elem.insertBefore(nodes[1], elem.firstChild);
    }    
    if(validCorners['bl']) {
        elem.appendChild(nodes[2]);
    }
    if(validCorners['br']) {
        //needs special handling
        if(elem.lastChild.className && elem.lastChild.className.match("\\bcorner_bl\\b"))
            elem.lastChild.appendChild(nodes[3]);
        else {
            elem.appendChild(document.createElement('div'));
            elem.lastChild.className += ' corner_spacer ';
            elem.lastChild.appendChild(nodes[3]);
        }
    }
}

function roundAll() {
    var toRound = getElementsByClassName('rounded');
    for(var i = 0; i < toRound.length; i++)
        roundCorners(toRound[i], arguments[0]);
}