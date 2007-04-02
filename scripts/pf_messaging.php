<?php
/*
*  pf_messaging.php - handles code pertaining to xml communication
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
?>