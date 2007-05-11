<?php
/*
*  request-common.php - handles logic for browsing the gallery
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


session_start();

include_once("../scripts/pf_constants.php");

/*############################
####   DELEGATION STUFF   ####
############################*/
/**
 Calls the function associated with the action
 If the function exists, the functions return value is returned
 Otherwise false is returned
 */
function initiateAction($data) {
    /*
    * HOW DELEGATION WORKS
    * --------------------
    * The DELEGATES array contains a key => value pair with each action
    * associated with a certain function.
    * The 'action' element of the _POST array is checked with the DELEGATES array
    * and the matching function is called. The function recieves all remaining arguments.
    */
    $DELEGATES = array( "next"=>"nextImage",
                        "previous"=>"previousImage",
                        "setthumbnail"=>"setThumbnail");
                        
    if(array_key_exists($data['action'], $DELEGATES) &&
        function_exists($DELEGATES[$data['action']]))
    {
        $func = $DELEGATES[$data['action']];
        unset($data['action']);
        return call_user_func($func, $data);
    }
    return false;
}




function inRange() {
    return $_SESSION['imageCount'] >= 0 && $_SESSION['imageCount'] < count($_SESSION['imageList']);
}

/**
 Modifies the current image pointer
*/
function nextImage($args) {
    ++$_SESSION['imageCount'];
    if(!inRange()) {//restore
        --$_SESSION['imageCount'];
    }
    return true;
}
/**
 @see nextImage
*/
function previousImage($args) {
    --$_SESSION['imageCount'];
    if(!inRange) {
        ++$_SESSION['imageCount'];
    }
    return true;
}

function setThumbnail($args) {
    $thumb = basename($args['thumbnail']);
    $srch = array_search($thumb, $_SESSION['imageList']);
    if($srch !== FALSE) {
        $_SESSION['imageCount'] = $srch; 
        return true;       
    }
    return false;
}

/**
 Returns the image at the imageCount location
*/
function getCurrentImage() {
    return $_SESSION['imageList'][$_SESSION['imageCount']];
}
?>