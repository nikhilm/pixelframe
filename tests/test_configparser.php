<?
//test configparser
//uses file test_config.xml

include("../scripts/pf_configparser.php");

//try read
$rd = ConfigReader("test_config.xml");
print_r($rd.get('settings/albums/album'));
?>