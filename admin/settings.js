/*
*  settings.js - contains Javascript for settings
*
* Copyright (C)      2007  Nikhil Marathe <nsm.nikhil@gmail.com>
*               
* This file is part of the PixelFrame project.
*
* This program is free software; you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation; either version 2 of the License, or
* (at your option) any later version.
* 
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* 
* You should have received a copy of the GNU General Public License
* along with this program; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
*/

/*
* Requires ../js/base.js, ../js/effects.js, ../js/ajax.js
*/

/********************************************
* CONSTANTS
*********************************************/
URL = "settings-control.php"


/*********************************************
 * UI RELATED FUNCTIONS
*********************************************/
function _restoreSize(elem, w, h) {
    $(elem).setStyle( { width:w+"px", height:h+"px" });
}

/*
 *Adds the cancel button to elem
*/
function addCancelButton(elem) {
    cancel = $('cancel-button');
    cancel.addEvent('click', clearPanel, false);
    cancel.style.visibility = "visible";
    cancel.style.display = "";
    $(elem).appendChild(cancel);
}

/**
* Clear the panel by hiding all children
*/
function clearPanel() {
    panel = $('panel');
    if(panel.childNodes) {
        $A(panel.childNodes).each(function (elem) { 
            if(elem.nodeType == Node.ELEMENT_NODE) {
                elem.style.visibility = "hidden";
                elem.style.display = "none";
            }
        }
        );
    }
    panel.style.display = "none";
}

/*
 * Show the panel along with the elem
*/
function showPanel(elem) {
    $('panel').style.display = "inherit";
    $('panel').style.visibility = "visible";
    $(elem).style.display = "inherit";
    $(elem).style.visibility = "visible";
    window.location="#";
}
    
/**
* Fetch and launch the edit panel for the album
*/
function launchEditPanel(evt) {
    
    clearPanel();
    //fetch and set edit panel data here
    
    addCancelButton('edit-panel');
    
    var aN = $('album-name'); 
    aN.replaceChild(evt.target.childNodes[0], aN.firstChild);
    
    
    showPanel('edit-panel');
    new Effects.BlindDown('edit-panel');
    
    $('album-delete').addEvent('click', deleteAlbum, false);
}

function launchAddAlbumPanel(evt) {
    evt.preventDefault();
    clearPanel();
    addCancelButton('add-album-panel');
    showPanel('add-album-panel');
    new Effects.BlindDown('add-album-panel', {duration:200,onComplete:function() {
        //solves a problem with showing the title
        $('add-album-panel').setStyle({overflow: "inherit"});
    }});
    $('album-add-name').focus();
}

/**
* Launch the success or error panels with a message
*
* @param mode string success / error
* @param msg string message
* @param delay int Amount of time after which panel should disappear in milliseconds (Default:1000ms)
*/
function launchMessagePanel(mode, msg) {
    clearPanel();

    panel = $(mode+"-panel");
    if(!panel) alert("Invalid mode");
    
    
    msgDiv = document.createElement('div');
    text = document.createTextNode(msg);
    msgDiv.appendChild(text);
    panel.replaceChild(msgDiv, panel.lastChild);
    showPanel(panel);
    window.location = "#";//move focus to top
    
    //save size
    w = panel.getDimensions().width;
    h = panel.getDimensions().height;
    setTimeout(function () {
        new Effects.BlindUp(panel, {
            onComplete:function() { _restoreSize(this, w, h); },
            duration:arguments[2]||1000
        });
        
        setTimeout(clearPanel, arguments[2]||1000);
    }, arguments[2]||1000);
}

function success(msg) { launchMessagePanel("success", msg); }
function error(msg) { launchMessagePanel("error", msg); }
function loading() { clearPanel();showPanel($('loading-panel')); }

/*
 * Setup the application on load
 */
function setup() {
    if($('album-list').childNodes) {
        $A($('album-list').childNodes).each( function (elem) { 
            if(elem.nodeType == Node.ELEMENT_NODE) {
                $(elem).addEvent('click', launchEditPanel, false);
            }
        });
    }
    
    try {
        //add album
        $("album-add-form").addEvent('submit', addAlbum, false);
        $("add-album-link").addEvent('click', launchAddAlbumPanel, false);
        //album list
        $("album-edit-form").addEvent('submit', saveChanges, false);
        //edit panel
        //$("album-delete").addEvent('click', deleteAlbum, false);
        //password
        $("password-change-form").addEvent('submit', changePassword, false);
    } catch(e) {}
    
}


/*****************************************************
 * MOST BACKGROUND/COMMUNICATION FUNCTIONS BEGIN HERE
*****************************************************/

/*
 * Accepts an XML document. If it contains a node status('error'/'success')
 * then it displays the contents of the node message
*/
function displayMessage(doc) {
    var reply = doc.getElementsByTagName('reply')[0];
    if(reply.getElementsByTagName('status')) {
        var status = reply.getElementsByTagName('status')[0].firstChild.nodeValue;
        if(reply.getElementsByTagName('message')) {
            var message = reply.getElementsByTagName('message')[0].firstChild.nodeValue
            if(status == 'error') error(message);
            else if(status == 'success') success(message);
        }
    }
}

/*
 * Formats data as a request
*/
function formatParameters(obj) {
    var formatted = [];
    for(item in obj)
        formatted.push(item + "=" + obj[item]);    
    return formatted.join('&');
}

/*
 * Send changes to server
*/
function saveChanges(evt) {
    evt.preventDefault();
    loading();
    //transmit changes
    new Ajax(URL, {}, {
            onSuccess: function(req) {
                displayMessage(req.responseXML);
                refreshAlbums();
            },
            onFailure: function(req) {
                error( req.status);
            },
            
            method:'post',
            payload:formatParameters({
                action:'save',
                name:'crap'
            })
        }
    );

}

/*
 * Change the password
*/
function changePassword(evt) {
    evt.preventDefault();
    
    //check if new password and confirm match
    pass = $("password-input").value;
    confirm = $("password-confirm-input").value;

    if(pass == "") {
        error( "The new password field is empty");
        $("password-input").focus();
        return;
    }

    if(pass != confirm) {
        error( "New password and confirmation do not match");
        $("password-input").focus();
        return;
    }

    loading();

    new Ajax(URL, {}, {
            onSuccess: function(req) {
                displayMessage(req.responseXML);
            },
            onFailure: function(req) {
                error( req.status);
            },
            
            method:'post',
            payload:formatParameters({
                action:'changepassword',
                newPassword:pass
            })
        }
    );
}

function addAlbum(evt) {
    evt.preventDefault();
    loading();
    new Ajax(URL, {}, {
            onSuccess: function(req) {
                var listElem = document.createElement('li');
                listElem.appendChild(document.createTextNode($('album-add-name').value));
                $(listElem).addEvent('click', launchEditPanel, false);
                $('album-list').appendChild(listElem);
                displayMessage(req.responseXML);
                $('album-add-form').reset();
            },
            onFailure: function(req) {
                displayMessage(req.responseXML);
            },
            
            method:'post',
            payload:formatParameters( {
                action:'addalbum',
                name:$('album-add-name').value,
                location:$('album-add-location').value
            })
        }
    );
}

function deleteAlbum(evt) {
    var deleteIt = confirm("Are you sure you want to delete the album? This action is irreversible!");
    if(!deleteIt) return;

    evt.preventDefault();
    
    loading();
    new Ajax(URL, {}, {
            onSuccess: function(req) { displayMessage(req.responseXML); },
            onFailure: function(req) { error(req.status); },
            method:'post',
            payload:formatParameters({
                action:"deletealbum",
                name:$('album-name').firstChild.nodeValue,
            })
        }
    );
    $('album-list').getElementsByTagName('li')[0].remove();
}
