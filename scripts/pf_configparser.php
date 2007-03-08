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
        $this->dom = new DomDocument;
        if(!$this->dom->load($filename)) {
            print("Could not open file $filename");
            exit();
        }
    }
    
    private function getNode($path) {
        $searchpath = explode('/', $path);
        $target = $this->dom;
        foreach($searchpath as $elem) {
            if($target = $target->getElementsByTagname($elem)) {
                $target = $target->item(0);
            }
            else {
                print("No such node $searchpath");
                exit();
            }
        }
        return $target;
    }
    
    private function getNodeInformation($target) {
        $ret = array();
        $ret["attributes"] = array();
        $ret["data"] = $target->textContent;
        
        $i = 0;
        while(($attribute = $target->attributes->item($i++)))
            $ret['attributes'][$attribute->name] = $attribute->value;
        
        return $ret;
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
        $target = $this->getNode($node);
        
        return $this->getNodeInformation($target);
    }
    
    /**
     * Returns an array of children of the node with each element being a sub array
     * in the form returned by get.
     * @param $node string The node whose children should be returned
     * @returns Array the array of nodes
    */
    function getChildren($node) {
        $ret = array();
        $target = $this->getNode($node);
        
        $i = 0;
        while(($child = $target->childNodes->item($i++))) {
            if($child->nodeType == XML_ELEMENT_NODE) {
                $ret[] = $this->getNodeInformation($child);
            }
        }
            
        return $ret;
    }
    
    
}