<?
//test configparser
//uses file test_config.xml

include("../scripts/pf_configparser.php");

//try read
$rd = new ConfigReader("test_config.xml");
$dat = $rd->get('settings/albums/album');
print_r($dat['attributes']);
?>