<?php
/*
*  pf_constants.php - Defines constants
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

define("PF_VERSION", 0.1);
define("PF_NAME", "PixelFrame");
define("PF_DEFAULT_PASSWORD", strtolower(PF_NAME));
define("PF_INSTALL_DIR", realpath('../').'/');
define("PF_REL_INSTALL_DIR", str_replace($_SERVER['DOCUMENT_ROOT'], "", PF_INSTALL_DIR)); //relative to document root
//assign both relative and absolute paths
foreach( array( "_CONFIG_FILE" => "config.xml",
                "_SCRIPTS_DIR" => "scripts/",
                "_IMAGES_DIR" => "images/" )
        as $k=>$v) {
        define("PF".$k, PF_INSTALL_DIR.$v);
        define("PF_REL".$k, PF_REL_INSTALL_DIR.$v);
}

define("PF_THUMBNAIL_DIR", "thumbnails/");//relative thumbnail directory
?>