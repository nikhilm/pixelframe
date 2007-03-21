<?php
/*
*  pf_delete_album.php - Handles deletion of albums.
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

// success and error are external functions in ../admin/settings-control.php

function init($args) {
    $name = $args['name'];
    
    $cp = new ConfigReader(PF_CONFIG_FILE);
    $albums = $cp->getChildren("settings/albums");
    if(!$albums) {
        error("It seems you don't have any albums. Why don't you create one.");
        return;
    }
    $location = "";
    //find our album location
    foreach($albums as $album) {
        if($album['attributes']['name'] == $name) {
            $location = $album['attributes']['location'];
        }
    }
    
    if($location == "") {
        error("Could not find album $name");
        return;
    }
    
    //see if it exists
    if(!is_dir($_SERVER['DOCUMENT_ROOT'].'/'.$location)) {
        error("Album directory does not exist");
        return;
    }
    
    $thumbnailDir = $_SERVER['DOCUMENT_ROOT'].'/'.$location.'/'.PF_THUMBNAIL_DIR;
    //try removing the thumbnails
    if(@chdir($thumbnailDir)) {        
        $pattern = array("*.jpg", "*.jpeg", "*.png");
        foreach($pattern as $pat) {
            foreach(glob($pat) as $file) {
                if(!unlink($file)) {
                    error("Could not remove thumbnail for image $file");
                    return;
                }
            }
        }
    }
    
    //try removing thumbnails directory
    @rmdir($thumbnailDir)
    
    //remove from config
    $cp = new ConfigWriter(PF_CONFIG_FILE);
    if(!($cp->removeWithAttributes("settings/albums/album", "name", $name) && $cp->close())) {
        error("Could not remove album $name");
        return;
    }
    
    success("Successfully removed album $name");
}
?>