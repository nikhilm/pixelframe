<? /*
  pf_theme_manager.php - contains functions related to theme management
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

function toHTML($name) {
        return "<option>$name</option>";
}


/**
 * Returns the list of installed themes in the following format
 * {
 *   theme_name => PF_REL_THEME_DIR.theme_dir.'/',
 *   ...
 * }
 */
function getThemeList() {
    $themedirs = array();
    chdir(PF_THEME_DIR);
    foreach(glob("*", GLOB_ONLYDIR) as $theme) {
        if(is_dir($theme))
            $themedirs[] = $theme;
    }
    
    $ret = array();
    foreach($themedirs as $themedir) {
        $cp = new ConfigReader($themedir.'/'.PF_THEME_INFO_FILE);
        $data = $cp->get("theme/name");
        $ret[$data['data']] = PF_REL_THEME_DIR.$theme.'/';
    }
    return $ret;
}

/**
 * Returns only theme names with their htmlised representation
 * { name=>html, ...}
 */
function getThemeNames() {
    $themes = getThemeList();
    $names = array();
    foreach($themes as $name=>$style) {
        $names[$name] = toHTML($name);
    }
    return $names;
}

/**
 * Gets the current theme for the album
*/
function getCurrentTheme($albumName) {
    $cp = new ConfigReader(PF_CONFIG_FILE);
    $albums = $cp->getChildren("settings/albums");
    foreach($albums as $album) {
        if($album['attributes']['name'] == $albumName) {
            return $album['attributes']['theme'];
        }
    }
}
