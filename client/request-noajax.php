<?php
/*
*  request-noajax.php - generates static pages
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
include_once("request-common.php");
include_once("thumbnail_lister.php");

//load the common page elements
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" >
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<?php

//now generate the headers
define(ALBUM_TITLE, $_SESSION['albumName']);
define(COMMON_STYLE, "style.css");
define(CLIENT_STYLE, $_SESSION['albumThemeLocation'].PF_THEME_STYLE_FILE);
define(CLIENT_JS, PF_REL_INSTALL_DIR."client/".PF_CLIENT_JS);
define(JUICE, PF_REL_INSTALL_DIR."js/juice.js");
$albumThemeLocation = $_SESSION['albumThemeLocation'];


if(/*defined($_SESSION['albumName']) && */initiateAction($_GET)) {
    define(CURRENT_IMAGE, $_SESSION['albumLocation'].'/'.getCurrentImage());    
    //include the theme index.html
    include($_SERVER['DOCUMENT_ROOT'].$albumThemeLocation."/index.html");
}
else {
    print("There was an error in processing the request.");
}

?>

