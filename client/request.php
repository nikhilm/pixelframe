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
include_once("request-common.php");


if(initiateAction($_GET)) {
    
    $out = "<image>".$_SESSION['albumLocation'].'/'.
            getCurrentImage()."</image>";
    $out .= "<thumbnail>".
            $_SESSION['albumLocation'].'/'.
            PF_THUMBNAIL_DIR.
            getCurrentImage().
            "</thumbnail>";
    success($out);
}
else
    error("PF_RESTORE_IMAGE");

?>