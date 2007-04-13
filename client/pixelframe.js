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
var LOADING_IMAGE = "../images/loading.gif";

var pf_originalImage = "";
//records already loaded thumbnails as strings
var pf_loadedThumbnails = [];

function setLoading() {
    pf_originalImage = $('main-image').src;
    $('main-image').src = LOADING_IMAGE;
}

//returns true if success, false if not
function goodStatus(doc) {
    var replyStatus = doc.getElementsByTagName('status')[0];
    if(replyStatus) {
        replyStatus = replyStatus.firstChild.nodeValue;
        return replyStatus == "success";
    }
}

function error(req) {
    alert("There was an error in fetching the image");
}

function setImage(req) {
    $('main-image').src = ( goodStatus(req.responseXML) ?
    req.responseXML.getElementsByTagName('image')[0].firstChild.nodeValue :
    pf_originalImage );
}

function setThumbnailAsImage(evt) {
    var Src = this.src;
    new Ajax(URL, {action:'setthumbnail', thumbnail:Src}, {
        onSuccess: function(req) {
            if(goodStatus(req.responseXML))
                setImage(req);
        },
        onFailure: error
    });
}
    
function nextImage(evt) {
    if(evt) Event.stopDefault(evt);
    setLoading();
    new Ajax(URL, {action:'next'}, {
        onSuccess: function (req) {
            if(goodStatus(req.responseXML)) {
                var thumbSrc = req.responseXML.getElementsByTagName('thumbnail')[0].firstChild.nodeValue;
                
                var exists = false;
                $A(pf_loadedThumbnails).each( function(thmb) {
                    if(thmb == thumbSrc) {
                        exists = true;
                        return;
                    }
                });
                
                if(!exists) {
                    var thumbImg = document.createElement('img');
                    thumbImg.src = thumbSrc;
                    $(thumbImg).addEvent('click', setThumbnailAsImage, false);
                    $('thumbnail-view').appendChild(thumbImg);
                    pf_loadedThumbnails.push(thumbSrc);
                }
            }
            setImage(req);
        },
        onFailure: error
    });
}

function prevImage(evt) {
    if(evt) Event.stopDefault(evt);
    setLoading();
    new Ajax(URL, {action:'previous'}, {
        onSuccess: setImage,
        onFailure: error
    });
}
 
function setup() {
    $('next-button').addEvent('click', nextImage, false);
    $('prev-button').addEvent('click', prevImage, false);
    nextImage(null);
}

window.addEvent('load', setup, false);