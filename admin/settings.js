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
    $('panel').style.display = "block";
    $('panel').style.visibility = "visible";
}
    
/**
* Fetch and launch the edit panel for the album
*/
function launchEditPanel() {
    clearPanel();
    showPanel();
    //fetch and set edit panel data here
    
    $('editPanel').style.visibility = "visible";
}

window.onload = clearPanel;