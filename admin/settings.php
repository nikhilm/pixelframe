<?php
include("../scripts/pf_constants.php");
?>
<!---Add password checking code here -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<title>Pixelframe: Settings</title>
<link rel="stylesheet" type="text/css" href="style.css" />
<script language="javascript" src="../js/base.js" type="text/javascript" />
<script language="javascript" src="../js/dom.js" type="text/javascript" />
<script language="javascript" src="../js/extension.js" type="text/javascript" />
<script language="javascript" src="../js/effects.js" type="text/javascript" />
<script language="javascript" src="../js/ajax.js" type="text/javascript" />
<script language="javascript" src="settings.js" type="text/javascript" />
</head>

<body onload="setup()">

<div id="wrapper">
<div id="header">
<img src="../images/logo.png" alt="Pixelframe Logo"/>
Settings
</div>

<div id="content">





<?php
/*##################################
###    PASSWORD IS GOOD ############
##################################*/

//retrieve password from config file
include(PF_SCRIPTS_DIR."pf_configparser.php");

$cr = new ConfigReader(PF_CONFIG_FILE);
$pass = $cr->get("settings/password");
$pass = $pass['data'];


/* TODO : perform password checks here
 This is a fake check */
if(md5($_POST['pf-password']) == $pass) {
?>

<!--Control and Information Panels hidden -->
<div id="panel">
<div id="success-panel">
<h2>Success!</h2>
</div>
<div id="error-panel">
<h2>Error!</h2>
</div>

<div id="add-album-panel">
<h2>Add Album</h2>

<form id="album-add-form" action="">
<div>
<label for="album-add-name">Name</label><input id="album-add-name" />
</div>
<div>
<label for="album-add-location">Location</label><input id="album-add-location" />
</div>

<input type="submit" id="album-add-button" value="Add Album" />
</form>
</div>

<div id="edit-panel">
<h2>Edit album</h2>

<!--Album stats -->
<form id="album-edit-form" action="">
<div>
<label for="album-name">Name:</label> <input id="album-name" value="Name" />
</div>

<div>
<label>Photos: &lt;Number&gt;</label>
</div>

<div>
<label for="album-theme-selector">Change theme:</label>
<select id="album-theme-selector">
<!--put themes here-->
<option>Hello</option>
</select>
</div>

<div>
<input type="submit" value="Save changes" id="album-save" />
</div>

<div style="border-top:inset 1px #000;margin-top:50px;">
<label for="album-delete">Delete this Album</label>
<input id="album-delete" type="button" value="Delete!" />
</div>
</form>

</div>
<div id="loading-panel">
</div>

<!--The cancel button used by all panels-->
<input type="button" value="Cancel" id="cancel-button" />
</div>




<!---Albums-->
<h3 id="album-header">Albums</h3>

<div id="add-album-div">
<a href="" id="add-album-link">Add an Album</a>
</div>
<h4>Select an Album below to change its settings:</h4>
<!--= getFormattedAlbumList(); -->
<ul id="album-list">
        <li>Album 1</li>
        <li>Album 2</li>
        <li>Europe pics</li>
</ul>




<h3 id="password-header">Change password</h3>
<div id="password-div">
<form action="" id="password-change-form">
<div>
<label for="password-input">New Password:</label><input id="password-input" type="password"/>
</div>
<div>
<label for="password-confirm-input">Confirm Password:</label><input id="password-confirm-input" type="password" />
</div>

<input type="submit" value="Change password" id="password-change-button" />
</form>



</div>








<?php
}

/*#################################
  # OTHERWISE SHOW PASSWORD FORM  #
  ###############################*/
else {
    //if its wrong display that
    if(isset($_POST['pf-password']))
        print("<strong style=\"color:red\">The password was wrong. Try again.</strong>\n");
?>

<h2>Enter password</h2>
<form action="settings.php" method="post" id="login-password-form">
<div>
<label for="pf-password">Password</label><input type="password" id="pf-password" name="pf-password" />
</div>
<div>
<input type="submit" value="Submit">
</div>
</form>

<?php } ?>
</div>


</div>

</body>
</html>
