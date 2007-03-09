<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<title>Pixelframe: Install</title>
<link rel="stylesheet" type="text/css" href="install_style.css" />
</head>
<body>
<div id="header">
<img src="../logo_icon.png" alt="Pixelframe Logo"/>
Install
</div>
<div class="message">
<?php

function success($msg) {
    print("<p class=\"success\">$msg</p>\n");
}
function error($msg) {
    print("<p class=\"error\">$msg</p>\n");
}

define("DIR", '/home/httpd/html');
if(is_writable(DIR))
    success(realpath(DIR)." is writeable");
else
    error("Could not write to ".realpath(DIR));

//generate default stuff

?>
</div>
</body>