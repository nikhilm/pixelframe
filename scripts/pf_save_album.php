<?php
/*
*  pf_save_album.php - Handles changing album theme
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

include_once("pf_constants.php");
include_once(PF_SCRIPTS_DIR."pf_configparser.php");

// success and error and outputXML are external functions in ../admin/settings-control.php
function init($args) {
    $albumName = $args['albumName'];
    $theme = $args['theme'];
    
    $location = "";
    
    //read, delete, write
    $cpr = new ConfigReader(PF_CONFIG_FILE);
    $albums = $cpr->getChildren('settings/albums');
    if(!$albums) {
        error("It seems you don't have any albums");
        return;
    }
    
    $found = FALSE;
    foreach($albums as $album) {
        if($album['attributes']['name'] == $albumName) {
            $found = TRUE;
            $location = $album['attributes']['location'];
            break;
        }
    }
    if(!$found) {
        error("The album $albumName was not found");
        return;
    }
    
    $cpr = new ConfigWriter(PF_CONFIG_FILE);
    if(!$cpr->removeWithAttributes('settings/albums/album', 'name', $albumName)) {
        error("Could not change theme for $albumName");
        return;
    }
    
    $attrs = array( "name" => $albumName, "location"=>$location, "theme"=>$theme);
    $cpr->addWithAttributes('settings/albums/album', $attrs, "");
    
    if(!$cpr->close()) {
        error("Could not write to configuration file");
        return;
    }
    
    success("Successfully changed theme for $albumName to $theme");
}