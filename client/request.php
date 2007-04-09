<?php
/*
*  request.php - handles ajax requests from client
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
include_once(PF_SCRIPTS_DIR."pf_messaging.php");


/*############################
####   DELEGATION STUFF   ####
############################*/

/*
 * HOW DELEGATION WORKS
 * --------------------
 * The DELEGATES array contains a key => value pair with each action
 * associated with a certain function.
 * The 'action' element of the _POST array is checked with the DELEGATES array
 * and the matching function is called. The function recieves all remaining arguments.
*/
define("PF_SETTINGS_ACTION", "action"); //the key for the action name in _POST
$DELEGATES = array( "next"=>"nextImage",
                    "previous"=>"previousImage",
                    "setthumbnail"=>"setThumbnail");
                    
if(array_key_exists($_GET[PF_SETTINGS_ACTION], $DELEGATES) &&
    function_exists($DELEGATES[$_GET[PF_SETTINGS_ACTION]]))
{
    $func = $DELEGATES[$_GET[PF_SETTINGS_ACTION]];    
    unset($_GET[PF_SETTINGS_ACTION]);
    call_user_func($func, $_GET) ;
    
}
else {
    error("No such action {$_GET[PF_SETTINGS_ACTION]}");
}




/*##################
## MAIN FUNCTIONS ##
##################*/
//generates album location and thumbnail location
//returns true if write successful
function formatAndWriteOutput() {
    if(inRange()) {
        $out = "<image>".$_SESSION['albumLocation'].'/'.
                $_SESSION['imageList'][$_SESSION['imageCount']]."</image>";
        $out .= "<thumbnail>".
                $_SESSION['albumLocation'].'/'.
                PF_THUMBNAIL_DIR.
                $_SESSION['imageList'][$_SESSION['imageCount']].
                "</thumbnail>";
        success($out);
        return true;
    }
    else {
        error("PF_RESTORE_IMAGE");
        return false;
    }
}

function inRange() {
    return $_SESSION['imageCount'] >= 0 && $_SESSION['imageCount'] < count($_SESSION['imageList']);
}

function nextImage($args) {
    ++$_SESSION['imageCount'];
    if(!formatAndWriteOutput()) //restore
        --$_SESSION['imageCount'];
}
function previousImage($args) {
    --$_SESSION['imageCount'];
    if(!formatAndWriteOutput())        
        ++$_SESSION['imageCount'];
}

function setThumbnail($args) {
    $thumb = basename($args['thumbnail']);
    $srch = array_search($thumb, $_SESSION['imageList']);
    if($srch !== FALSE) {
        $_SESSION['imageCount'] = $srch;
        formatAndWriteOutput();
    }
}