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
}
    
/**
* Fetch and launch the edit panel for the album
*/
function launchEditPanel() {
    clearPanel();
    //fetch and set edit panel data here
    
    addCancelButton('edit-panel');
    
    var heading = $('album-title').firstChild;
    heading.nodeValue = this.childNodes[0].nodeValue;
    
    $('album-save').addEvent('click', saveChanges, false);
    
    
    showPanel('edit-panel');
    new Effects.BlindDown('edit-panel');
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
    setTimeout(function () {
        new Effects.BlindUp(panel, {restoreSize:true, duration:arguments[2]||1000});
        setTimeout(clearPanel, arguments[2]||1000);
    }, arguments[2]||1000);
}

/*
 * Setup the application on load
 */
function setup() {
    //album list
    $('album-save').addEvent('click', saveChanges, false);

    $A($('album-list').childNodes).each( function (elem) { 
        if(elem.nodeType == Node.ELEMENT_NODE)
            $(elem).addEvent('click', launchEditPanel, false);
        }
    );

    //password
    $("password-change-button").addEvent('click', changePassword, false);
    $("password-change-button").addEvent('submit', changePassword, false);
}


/*****************************************************
 * MOST BACKGROUND/COMMUNICATION FUNCTIONS BEGIN HERE
*****************************************************/

/*
 * Send changes to server
*/
function saveChanges() {
    //transmit changes
    //Ajax.Request(URL, {
    //    parameters:{
    //        action:"save",
    //        name:"name",
    //        etc
    //    },
    //    onSuccess: function(req) {
    //        launchMessagePanel("success", req.status);
    //        refreshAlbums();
    //    },
    //    onFailure: function(req) {
    //        launchMessagePanel("error", req.status);
    //    }
    //});

    //Set onSuccess to launch success panel with message passed by server and refresh the album list
    //onFailure to launch error panel
    launchMessagePanel("success", "Settings saved");
}

/*
 * Change the password
*/
function changePassword() {
    console.log("Called");
    //check if new password and confirm match
    pass = $("password-input").value;
    confirm = $("password-confirm-input").value;

    if(pass == "") {
        console.log("empty");
        launchMessagePanel("error", "The new password field is empty");
        $("password-input").focus();
        return;
    }

    if(pass != confirm) {
        launchMessagePanel("error", "New password and confirmation do not match");
        $("password-input").focus();
        return;
    }

    //Ajax.Request(URL, {
    //    parameters: {
    //        action:"changepassword",
    //        newpassword:pass
    //    },
    //    onSuccess: function(req) {
    //        launchMessagePanel("success", req.status);
    //    },
    //    onFailure: function(req) {
    //        launchMessagePanel("error", req.status);
    //    }
    //});
    launchMessagePanel("success", "Password successfully changed");
}
