<? /*
  pf_thumbnail.php - contains functions related to generating thumbnails
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

/**
 * Class ConfigReader
 * Reads configuration files and returns the data
 *
 * @author Nikhil Marathe
*/
class ConfigReader {
    private $dom = NULL;
    
    /**
     * Parses the given configuration file
     *
     * @param $filename string The file to parse
     */
    function __construct($filename) {
        if(!$dom = domxml_open_file($filename)) {
            print("Could not open file $filename");
            exit();
        }
    }
    
    /**
     * Returns an associative array containing the node attributes and data
     * In case multiple nodes of the same name exist only the first one is returned
     * The returned array is of the following format
     * {
     *   "attributes" => {
     *              attribute1 => value1,
     *              attribute 2=> value2,
     *              ...
     *              },
     *   "data" => data(string)
     * }
     *
     * @param $node string The node to fetch data for. Node can be nested with nodes seperated by '/'
     * @returns Array The array containing the data as described above
    */
    function get($node) {
        $searchpath = explode('/', $node);
        
        $target = $dom;
        foreach($searchpath as $elem) {
            if($target->get_elements_by_tagname($elem)) {
                $target = $elem[0];
            }
        }
        
        $ret = array();
        $ret["attributes"] = array();
        $ret["data"] = $target->get_content();
        
        foreach($target->attributes() as $attr) {
            $ret["attributes"][$attr->name()] = $attr->value();
        }
        
        return $ret;
    }
}