<?
//test configparser
//uses file test_config.xml

include("../scripts/pf_configparser.php");

//try read
$rd = new ConfigReader("test_config.xml");
$dat = $rd->getChildren('settings/albums');
print_r($dat);

//try write
$rd = new ConfigWriter("/home/httpd/html/test_album.xml");
$rd->add("settings/albums/album", "Nikhil M", TRUE);
$attr = array();
$attr['created'] = date("Y");
$attr['owner'] = 'nsm';
//$rd->addWithAttributes("settings/password", $attr, "Pasword");

//$rd->remove("settings/albums/album");
$rd->close();
?>