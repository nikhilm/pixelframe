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
<img src="../images/logo.png" alt="Pixelframe Logo"/>
Install
</div>
<div class="message">
<?php

include_once("../scripts/pf_constants.php");
include_once(PF_SCRIPTS_DIR."pf_configparser.php");

define("GOOD_TO_GO", PF_NAME." is all set to go.  The default password is <br /><strong>".PF_DEFAULT_PASSWORD."</strong><br />To change password, add albums or change settings go to <a href=\"settings.php\">settings.php</a>\n");

function success($msg) {
    print("<p class=\"success\">$msg</p>\n");
}
function error($msg) {
    print("<p class=\"error\">$msg</p>\n");
}

//if all done is true at the end give the go ahead
$allDone = TRUE;

if(is_writable(PF_INSTALL_DIR))
    success(PF_INSTALL_DIR." is writeable");
else {
    error("Could not write to ".PF_INSTALL_DIR);
    $allDone = FALSE;
}

//check for gd and dom xml extensions
if(!extension_loaded('dom')) {
    error("The DOM extension is not loaded. It is needed for Pixelframe to run");
    $allDone = FALSE;
}
if(!extension_loaded('gd')) {
    error("The GD extension is not loaded. It is needed for Pixelframe to run");
    $allDone = FALSE;
}

//generate default stuff if needed
if(file_exists(PF_CONFIG_FILE)) {
    if($allDone)
        success(GOOD_TO_GO);
}
else {    
    $conf = new ConfigWriter(PF_CONFIG_FILE);
    $conf->add("settings/password", md5(PF_DEFAULT_PASSWORD));
    if(!$conf->close()) {
        error("Could not write to file ".PF_CONFIG_FILE);
        $allDone = FALSE;
    }
    else {
        if($allDone) {
            success("Wrote ".PF_NAME." settings.");
            success(GOOD_TO_GO);
        }
    }
}

?>
</div>
</body>