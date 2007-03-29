<?php
/*
*  pf_add_album.php - Handles adding of albums.
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
include_once(PF_SCRIPTS_DIR."pf_thumbnail.php");
include_once(PF_SCRIPTS_DIR."pf_configparser.php");
include_once(PF_SCRIPTS_DIR."pf_theme_manager.php");

// success and error are external functions in ../admin/settings-control.php

function init($args) {
    $name = $args['name'];
    $location = $args['location'];
    
    //check if album already exists
    $cp = new ConfigReader(PF_CONFIG_FILE);
    $albums = $cp->getChildren("settings/albums");
    if($albums)
        foreach($albums as $album) {
            if($album['attributes']['name'] == $name) {
                error("Album $name already exists!");
                return;
            }
        }
        
        
    
    define("ALBUM_DIR", $_SERVER['DOCUMENT_ROOT'].'/'.$location);
    //check if it exists
    if(!is_dir(ALBUM_DIR)) {
        error("It seems like the directory $location does not exist.");
        return;
    }
    //check if directory writeable
    if(!is_writeable(ALBUM_DIR)) {
        error("Could not create album. Could not write to $location.".ALBUM_DIR);
        return;
    }
    
    //get a list of photos (jpg/png)
    //generate thumbnails
    chdir(ALBUM_DIR);
    
    //try to make thumbnail directory
    if(!is_dir(PF_THUMBNAIL_DIR)) {
        if(!mkdir(PF_THUMBNAIL_DIR)) {
            error("Could not create thumbnails directory in $location");
            return;
        }
    }
    //generate thumbnails
    //it seems glob cannot take multiple patterns
    $pattern = array("*.jpg", "*.jpeg", "*.png");
    foreach($pattern as $pat) {
        foreach(glob($pat) as $file) {
            if(!makeThumbnail($file, PF_THUMBNAIL_DIR.$file)) {
                error("Could not create thumbnail for image $file");
                return;
            }
        }
    }
    
    //add album to config file
    $cp = new ConfigWriter(PF_CONFIG_FILE);
    $attributes = array( "name" => $name, "location" => $location, "theme" => PF_DEFAULT_THEME );
    $cp->addWithAttributes('settings/albums/album', $attributes, "");
    if(!$cp->close()) {
        error("Could not write to configuration file");
    }
    
    success("Successfully created album $name in $location.");
}