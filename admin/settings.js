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
    cancel.setStyle({visibility : "visible", display : ""});
    $(elem).appendChild(cancel);
}

/**
* Clear the panel by hiding all children
*/
function clearPanel() {
    var panel = $('panel');
    if(panel.childNodes) {
        $A(panel.childNodes).each(function (elem) { 
            if(elem.nodeType == 1 /* element node */) {
                $(elem).setStyle({visibility : "hidden", display : "none"});
            }
        }
        );
    }
    panel.setStyle({display : "none"});
}

/*
 * Show the panel along with the elem
*/
function showPanel(elem) {
    var panel = $('panel');
    panel.setStyle({visibility : "visible", display : "block"});
    $(elem).setStyle({visibility : "visible", display : "block"});
    window.location = "#panel";
}
    
/**
* Fetch and launch the edit panel for the album
*/
function launchEditPanel(evt) {
    clearPanel();
    loading();
    var albumName = (evt.target||evt.srcElement).childNodes[0].nodeValue;
    new Ajax(URL, {}, {
        method:'post',
        payload: formatParameters({
            action:'gettheme',
            name:albumName
        }),
        onSuccess:function(req) {
            /* getthemelist uses a different response than other actions */
            var doc = req.responseXML.getElementsByTagName('reply')[0];
            var status = doc.getElementsByTagName('status')[0].firstChild.nodeValue;
            if(status == "success") {
                clearPanel();
                
                var themes = doc.getElementsByTagName('theme');
                $A(themes).each( function(theme) {
                    var themeName = theme.firstChild.nodeValue;
                    
                    var option = document.createElement('option');
                    option.appendChild(document.createTextNode(themeName));
                    
                    selectedThemeIsDefault = false;
                    if(theme.hasAttribute)
                        selectedThemeIsDefault = theme.hasAttribute('default');
                    else if(theme.attributes)
                        selectedThemeIsDefault = theme.attributes['default'];
                    if(selectedThemeIsDefault) {
                        option.setAttribute('selected', 'true');
                    }
                        
                    $('album-theme-selector').appendChild(option);
                });
                addCancelButton('edit-panel');
            
                var aN = $('album-name'); 
                aN.replaceChild(document.createTextNode(albumName), aN.firstChild);
            
                showPanel('edit-panel');
                new Effects.BlindDown('edit-panel');
            
                $('album-save').addEvent('submit', saveChanges, false);
                $('album-delete').addEvent('click', deleteAlbum, false);
            }
            else if(status == "error") {
                error("There was an error retrieving album information. Please check that "+albumName+" exists.");
            }
        },
        onFailure:requestFailed
    });
    
}

function launchAddAlbumPanel(evt) {
    if(evt) Event.stopDefault(evt);
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
    var panel = $(mode+"-panel");
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
            onComplete:function() { _restoreSize(panel, w, h); },
            duration:arguments[2]||1000
        });
        
        setTimeout(clearPanel, arguments[2]||1000);
    }, arguments[2]||1000);
}

function success(msg) { launchMessagePanel("success", msg); }
function error(msg) { launchMessagePanel("error", msg); }
function loading() { clearPanel();showPanel('loading-panel'); }

/*
 * Setup the application on load
 */
function setup() {
    if($('album-list').childNodes) {
        $A($('album-list').childNodes).each( function (elem) { 
            if(elem.nodeType == 1 /* element node */) {
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

window.addEvent('load', setup, false);
/*****************************************************
 * MOST BACKGROUND/COMMUNICATION FUNCTIONS BEGIN HERE
*****************************************************/

//returns true if success, false if not
function goodStatus(doc) {
    var reply = doc.getElementsByTagName('reply')[0];
    if(reply.getElementsByTagName('status')) {
        var status = reply.getElementsByTagName('status')[0].firstChild.nodeValue;
        return status == "success";
    }
}
/*
 * Accepts an XML document. If it contains a node status('error'/'success')
 * then it displays the contents of the node message
*/
function displayMessage(doc) {
    var reply = doc.getElementsByTagName('reply')[0];
    if(reply.getElementsByTagName('message')) {
        var message = reply.getElementsByTagName('message')[0].firstChild.nodeValue
        if(goodStatus(doc)) success(message);
        else error(message);
    }
}

function requestFailed(req) {
    error("There was a problem connecting to the server.");
}

/*
 * Formats data as a request
*/
function formatParameters(obj) {
    var formatted = [];
    for(param in obj)
        formatted.push(param + "=" + obj[param]);    
    return formatted.join('&');
}

/*
 * Send changes to server
*/
function saveChanges(evt) {
    if(evt) Event.stopDefault(evt);
    loading();
    //transmit changes
    new Ajax(URL, {}, {
            onSuccess: function(req) {
                //remove all children of theme selector
                $('album-theme-selector').removeNodes();
                displayMessage(req.responseXML);
            },
            onFailure: requestFailed,
            
            method:'post',
            payload:formatParameters({
                action:'savechanges',
                //ripped straight from firebug console LOL
                theme:$('album-theme-selector').getElementsByTagName('option')[$('album-theme-selector').selectedIndex].firstChild.nodeValue,
                albumName:$('album-name').firstChild.nodeValue
            })
        }
    );

}

/*
 * Change the password
*/
function changePassword(evt) {
    if(evt) Event.stopDefault(evt);
    
    //check if new password and confirm match
    pass = $("password-input").value;
    confirmPass = $("password-confirm-input").value;

    if(pass == "") {
        error( "The new password field is empty");
        $("password-input").focus();
        return;
    }

    if(pass != confirmPass) {
        error( "New password and confirmation do not match");
        $("password-input").focus();
        return;
    }

    loading();

    new Ajax(URL, {}, {
            onSuccess: function(req) {
                displayMessage(req.responseXML);
                $('password-change-form').reset();
            },
            onFailure: requestFailed,
            
            method:'post',
            payload:formatParameters({
                action:'changepassword',
                newPassword:pass
            })
        }
    );
}

function addAlbum(evt) {
    if(evt) Event.stopDefault(evt);
    loading();
    new Ajax(URL, {}, {
            onSuccess: function(req) {
                if(goodStatus(req.responseXML)) {
                    var listElem = document.createElement('li');
                    listElem.appendChild(document.createTextNode($('album-add-name').value));
                    $(listElem).addEvent('click', launchEditPanel, false);
                    $('album-list').appendChild(listElem);
                    displayMessage(req.responseXML);
                    $('album-add-form').reset();
                    $('no-albums-message').setStyle({display:'none', visibility:'hidden'});
                }
                else { displayMessage(req.responseXML); }
            },
            onFailure: requestFailed,
            
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
    if(evt) Event.stopDefault(evt);
    var deleteIt = confirm("Are you sure you want to delete the album? This action is irreversible!");
    if(!deleteIt) return;

    
    loading();
    new Ajax(URL, {}, {
            onSuccess: function(req) {
                if(goodStatus(req.responseXML)) {    
                    var albums = $('album-list').getElementsByTagName('li');
                    var currentAlbumName = $('album-name').firstChild.nodeValue;
                    $A(albums).each(function(elem) {
                        if(elem.firstChild.nodeValue == currentAlbumName) {
                            elem.remove();
                        }
                    });
                    displayMessage(req.responseXML);
                    
                    if($('album-list').getElementsByTagName('li').length == 0)
                        $('no-albums-message').setStyle({display:'block', visibility:'visible'});
                }
                else { displayMessage(req.responseXML); }
            },
            onFailure: requestFailed,
            method:'post',
            payload:formatParameters({
                action:"deletealbum",
                name:$('album-name').firstChild.nodeValue
            })
        }
    );
}
