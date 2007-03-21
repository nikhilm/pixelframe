<?php
/*
*  pf_get_theme.php - Returns installed themes and marks default theme
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
include_once(PF_SCRIPTS_DIR."pf_theme_manager.php");

// success and error and outputXML are external functions in ../admin/settings-control.php
function init($args) {
    $albumName = $args['name'];
    
    $themeList = getThemeNames();
    $albumDefault = getCurrentTheme($albumName);
    $outString = "";
    foreach($themeList as $name=>$html) {
        $outString .="<theme ";
        if($name == $albumDefault)
            $outString .= "default=\"true\"";
        $outString .= ">$name</theme>";
    }
    outputXML("<status>success</status>$outString");
}
?>