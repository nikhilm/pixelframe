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

 
function setup() {
    //temp list
    var images = ['cube.png', 'flower.png', 'drops.png', 'dont_panic.png'];
    console.log($('next-button'), typeof $('next-button'));
    $('next-button').addEvent('click', nextImage, false);
    $('prev-button').addEvent('click', prevImage, false);
    
    var count = 0;
    function nextImage(evt) {
        $('main-image').src = '/albums/inkscape/'+images[++count];
    }
    
    function prevImage(evt) {
        $('main-image').src = '/albums/inkscape/'+images[--count];
    }
}

window.addEvent('load', setup, false);