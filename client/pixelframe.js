/*
*  pixelframe.js - handles all client functions for Pixelframe gallery
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

var URL = "request.php";

//returns true if success, false if not
function goodStatus(doc) {
    var reply = doc.getElementsByTagName('reply')[0];
    if(reply.getElementsByTagName('status')) {
        var status = reply.getElementsByTagName('status')[0].firstChild.nodeValue;
        return status == "success";
    }
}

function error(req) {
    alert("There was an error in fetching the image");
}

function setImage(req) {
    if(goodStatus(req.responseXML)) {
        $('main-image').src = req.responseXML.getElementsByTagName('image')[0].firstChild.nodeValue;
    }
}
    
function nextImage(evt) {
    evt.preventDefault();
    new Ajax(URL, {action:'next'}, {
        onSuccess: setImage,
        onFailure: error
    });
}

function prevImage(evt) {
    evt.preventDefault();
    new Ajax(URL, {action:'previous'}, {
        onSuccess: setImage,
        onFailure: error
    });
}
 
function setup() {
    $('next-button').addEvent('click', nextImage, false);
    $('prev-button').addEvent('click', prevImage, false);
    
}

window.addEvent('load', setup, false);