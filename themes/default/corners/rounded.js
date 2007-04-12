// Copyright Nikhil Marathe (2007) nsm.nikhil@gmail.com
// GNU GPL 2.0

/*
* Accepts the element to round and the corners to round
* Valid values for the second argument are {top:true/false, bottom:true/false]
*/
function roundCorners(elem) {
    var corner_classes = ['corner_tl', 'corner_tr', 'corner_bl', 'corner_br'];
    //create the appropriate div elements
    var nodes = [];        
    for(i = 0; i < corner_classes.length; i++) {
        nodes.push(document.createElement('div'));
        nodes[i].className = corner_classes[i];
    }
    
    var validCorners = []
    if(!arguments[1]) {
        corners = ['tl', 'tr', 'bl', 'br']
        for(var i = 0; i < corners.length; i++)
            validCorners[corners[i]] = true;
    }
    else {
        for(prop in arguments[1])
            validCorners[prop] = arguments[1][prop];
    }
    
    if(validCorners['tl'] ) {
        elem.insertBefore(nodes[0], elem.firstChild);
    }
    if(validCorners['tr']) {
        //needs special handling
        if($(elem.firstChild).hasClassName("corner_tl")) {
            elem.replaceChild(nodes[1], elem.firstChild);
            elem.firstChild.appendChild(nodes[0]);
        }
        else {
            elem.insertBefore(document.createElement('div'), elem.firstChild);
            elem.firstChild.addClass('corner_spacer');
            elem.firstChild.appendChild(nodes[1]);
        }
    }    
    if(validCorners['bl']) {
        elem.appendChild(nodes[2]);
    }
    if(validCorners['br']) {
        //needs special handling
        if($(elem.lastChild).hasClassName("corner_bl"))
            elem.lastChild.appendChild(nodes[3]);
        else {
            elem.appendChild(document.createElement('div'));
            elem.lastChild.addClass('corner_spacer');
            elem.lastChild.appendChild(nodes[3]);
        }
    }
}

function roundAll() {
    var toRound = getElementsByClassName('rounded');
    for(var i = 0; i < toRound.length; i++)
        roundCorners(toRound[i], arguments[0]);
}