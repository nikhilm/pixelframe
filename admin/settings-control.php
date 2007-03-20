<?/*
  settings-control.php - handles and delegates modification of pixelframe settings.
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

include_once('../scripts/pf_constants.php');

//CONSTANTS
define("PF_SETTINGS_DOCUMENT_ROOT", "reply");
define("PF_STATUS_TAG", "status");
define("PF_STATUS_SUCCESS", "success");
define("PF_STATUS_ERROR", "error");
define("PF_MESSAGE_TAG", "message");
define("PF_SETTINGS_ACTION", "action"); //the key for the action name in _POST

/*######################
####   UTILITIES   #####
######################*/

/*
 * outputs XML header and stuff before outputting message
*/
function outputXML($message) { 
    header('Content-Type: text/xml');
    print('<?xml version="1.0" encoding="utf-8" ?>');
    print('<'.PF_SETTINGS_DOCUMENT_ROOT.'>');
    print($message);
    print('</'.PF_SETTINGS_DOCUMENT_ROOT.'>');
}

/*
 * Handles message formatting
*/
function formatMessage($status, $message) {
    $out = "<".PF_STATUS_TAG.">".$status."</".PF_STATUS_TAG.">";
    $out .= "<".PF_MESSAGE_TAG.">".$message."</".PF_MESSAGE_TAG.">";
    outputXML($out);
}

/*
 * outputs message with success status
*/
function success($message) {
    formatMessage(PF_STATUS_SUCCESS, $message);
}

/*
 * outputs message with error status
*/
function error($message) {
    formatMessage(PF_STATUS_ERROR, $message);
}

/*############################
####   DELEGATION STUFF   ####
############################*/

/*
 * HOW DELEGATION WORKS
 * --------------------
 * The DELEGATES array contains a key => value pair with each action
 * associated with a certain script.
 * The 'action' element of the _POST array is checked with the DELEGATES array
 * and the matching script is included. After inclusion the init function is called
 * with all remaining arguments in the _POST array.
 * All scripts in the DELEGATES array MUST IMPLEMENT an init method accepting an array
*/

$DELEGATES = array( "savechanges" => "pf_save_album.php",
                    "changepassword" => "pf_change_password.php",
                    "addalbum" => "pf_add_album.php",
                    "deletealbum" => "pf_delete_album.php" );

if(array_key_exists($_POST[PF_SETTINGS_ACTION], $DELEGATES)) {
    include_once(PF_SCRIPTS_DIR.$DELEGATES[$_POST[PF_SETTINGS_ACTION]]);
    unset($_POST[PF_SETTINGS_ACTION]);
    init($_POST);
}
else {
    error("No such action {$_POST['action']}.");
}

?>
