<?php
/*
*  thumbnail_lister.php - generates an html thumbnail list
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

include_once("../scripts/pf_constants.php");
// assumes that $_SESSION['imageList'] and $_SESSION['albumLocation'] is set

session_start();

function generateThumbnailsList() {
    foreach($_SESSION['imageList'] as $image) {
        print("<a href=\"");
        print(PF_REL_INSTALL_DIR."client/request-noajax.php?action=setthumbnail&thumbnail=".$image);
        print ("\"><img src=\"");
        print($_SESSION['albumLocation'].'/'.PF_THUMBNAIL_DIR.$image);
        print("\"></img></a>");
    }
}
?>
