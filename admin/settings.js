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
* Requires ../js/base.js
*/

/*
 *Adds the cancel button to elem
*/
function addCancelButton(elem) {
    cancel = $('cancel-button');
    cancel.onclick = clearPanel;
    cancel.style.visibility = "visible";
    $(elem).appendChild(cancel);
}

/**
* Clear the panel by hiding all children
*/
function clearPanel() {
    panel = $('panel');
    $A(panel.childNodes).each(function (elem) { 
        if(elem.nodeType == Node.ELEMENT_NODE)
            elem.style.visibility = "hidden";
        }
    );
    panel.style.display = "none";
}

/*
 * Show the panel
*/
function showPanel() {
    $('panel').style.display = "inherit";
    $('panel').style.visibility = "visible";
}
    
/**
* Fetch and launch the edit panel for the album
*/
function launchEditPanel() {
    clearPanel();
    showPanel();
    //fetch and set edit panel data here
    
    $('edit-panel').style.visibility = "visible";
    addCancelButton('edit-panel');
    
    var heading = $('album-title').firstChild;
    heading.nodeValue = this.childNodes[0].nodeValue;
}

/*
 * Setup the application on load
 */
function setup() {
    $('album-save').onclick=saveChanges;

    $A($('album-list').childNodes).each( function (elem) { 
        if(elem.nodeType == Node.ELEMENT_NODE)
            elem.onclick = launchEditPanel;
        }
    );
}

/*
 * Send changes to server
*/
function saveChanges() {}
//window.onload = setup();