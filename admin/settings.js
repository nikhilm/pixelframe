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
* Requires ../js/base.js, ../js/effects.js
*/

/********************************************
* CONSTANTS
*********************************************/
URL = "index.php"


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
    $A(panel.childNodes).each(function (elem) { 
        if(elem.nodeType == Node.ELEMENT_NODE) {
            elem.style.visibility = "hidden";
            elem.style.display = "none";
        }
    }
    );
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
    
    var heading = $('edit-panel').getElementsByTagName('h2')[0];
    heading.childNodes[0].nodeValue = "Edit "+evt.target.childNodes[0].nodeValue;
    
    
    showPanel('edit-panel');
    new Effects.BlindDown('edit-panel');
    
    $('album-delete').addEvent('click', deleteAlbum, false);
}

function launchAddAlbumPanel(evt) {
    evt.preventDefault();
    clearPanel();
    addCancelButton('add-album-panel');
    showPanel('add-album-panel');
    //new Effects.BlindDown('add-album-panel');
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

/*
 * Setup the application on load
 */
function setup() {

    $A($('album-list').childNodes).each( function (elem) { 
        if(elem.nodeType == Node.ELEMENT_NODE) {
            $(elem).addEvent('click', launchEditPanel, false);
        }
    });
    
    
    //add album
    $("album-add-form").addEvent('submit', addAlbum, false);
    $("add-album-link").addEvent('click', launchAddAlbumPanel, false);
    //album list
    $("album-edit-form").addEvent('submit', saveChanges, false);
    //edit panel
    //$("album-delete").addEvent('click', deleteAlbum, false);
    //password
    $("password-change-form").addEvent('submit', changePassword, false);
    
}


/*****************************************************
 * MOST BACKGROUND/COMMUNICATION FUNCTIONS BEGIN HERE
*****************************************************/

/*
 * Send changes to server
*/
function saveChanges(evt) {
    evt.preventDefault();
    //transmit changes
    //Ajax.Request(URL, {
    //    parameters:{
    //        action:"save",
    //        name:"name",
    //        etc
    //    },
    //    onSuccess: function(req) {
    //        success( req.status);
    //        refreshAlbums();
    //    },
    //    onFailure: function(req) {
    //        error( req.status);
    //    }
    //});

    //Set onSuccess to launch success panel with message passed by server and refresh the album list
    //onFailure to launch error panel
    success( "Settings saved");
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

    //Ajax.Request(URL, {
    //    parameters: {
    //        action:"changepassword",
    //        newpassword:pass
    //    },
    //    onSuccess: function(req) {
    //        success( req.status);
    //    },
    //    onFailure: function(req) {
    //        error( req.status);
    //    }
    //});
    success( "Password successfully changed");
}

function addAlbum(evt) {
    evt.preventDefault();
//     Ajax.Request(URL, {
//         parameters: {
//             action:"addalbum",
//             name:/* TODO */,
//             location:/* TODO */
//         },
//         onSuccess: function(req) {
//             success( req.status);
//         },
//         onFailure: function(req) {
//             luanchMessagePanel("error", req.status);
//         }
//     });
//     
    success("Album added");
    var albumName = $('album-add-name').value;
    var li = document.createElement('li');
    li.appendChild(document.createTextNode(albumName));
    $('album-list').appendChild(li);
    $('album-add-form').reset();
}

function deleteAlbum(evt) {
    var deleteIt = confirm("Are you sure you want to delete the album? This action is irreversible!");
    if(!deleteIt) return;

    evt.preventDefault();
//     Ajax.Request(URL, {
//         parameters: {
//             action:"deletealbum",
//             name:/* TODO */,
//             location:/* TODO */
//         },
//         onSuccess: function(req) { success(req.status); },
//         onFailure: function(req) { error(req.status); }
//     });
    success("Album deleted");
    $('album-list').getElementsByTagName('li')[0].remove();
}
