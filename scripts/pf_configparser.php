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
        if(!@$this->dom->load($filename)) {
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

/**
 * Class ConfigWriter
 * Allows creation and editing of configuration files
 * Remember to call close to save changes
 *
 * @author Nikhil Marathe
*/
class ConfigWriter {
    private $dom = NULL;
    private $filename = "";
    
    /**
     * Create/Edit a configuration file
     * @param $filename String the file edit
    */
    function __construct($filename) {
        $this->filename = $filename;
        //try opening otherwise we will create new
        $this->dom = new DOMDocument;
        if(!@$this->dom->load($filename))
            $this->dom = DOMImplementation::createDocument();
        
        $this->dom->formatOutput = TRUE;
    }
    
    /*
     * Takes a / seperated string and adds nodes as necessary ONLY till the second-last node.
     * Returns the second last node
    */
    function ensureNodes($path) {
        $nodes = explode('/', $path);
        array_pop($nodes);
        $target = $this->dom;
        foreach($nodes as $elem) {
            print_r($target);
            //if $elem exists then set target to elem
            if($target->getElementsByTagName($elem)->length == 0) {
                $target->appendChild($this->dom->createElement($elem));
            }            
            $target = $target->getElementsByTagName($elem)->item(0);
        }
        return $target;
    }
    
    /**
     * Adds an option to the file with data data
     * Note: the replace parameter will only check if the node name is the same
     *
     * @param $name String The name of the option
     * @param $data String the data
     * @param $replace Boolean Replaces an already existing node instead of appending
    */
    function add($name, $data, $replace=FALSE) {
        $parent = $this->ensureNodes($name);
        $n = array_pop(explode('/', $name));
        
        $node = $this->dom->createElement($n);
        $node->appendChild($this->dom->createTextNode($data));
        
        
        if($replace) {
            $nodeToReplace = NULL;
            $i = 0;
            $child = NULL;
            while(($child = $parent->childNodes->item($i++))) {
                if($node->nodeName == $child->nodeName) {
                    $nodeToReplace = $child;
                    break;
                }
            }
            $parent->replaceChild($node, $nodeToReplace);
        }
        else {        
            $parent->appendChild($node);
        }
        return $node;
    }
    
    /**
     * Adds an option alongwith attributes
     * @param $attrs Array array of attributes in name=>value pairs
    */
    function addWithAttributes($name, $attrs, $data) {
        print($data);
        $n = $this->add($name, $data);
        foreach($attrs as $name=>$value)
            $n->setAttribute($name, $value);
        return $n;
    }
    
    /**
     * Remove option
    */
    function remove($name) {
        $path = explode('/', $name);
        $node = array_pop($path);
        $target = $this->dom;
        foreach($path as $elem) {
            if($target->getElementsByTagName($elem)->length == 0)
                return;
            $target = $target->getElementsByTagName($elem)->item(0);
        }
        return @$target->removeChild(@$target->getElementsByTagName($node)->item(0));
    }
    
    /**
     * Saves and closes the file
    */
    function close() {
        if(!$this->dom->save($this->filename))
            print("Error");
    }
}
            