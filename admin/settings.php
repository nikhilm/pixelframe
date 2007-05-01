<?php
include_once("../scripts/pf_constants.php");
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<title>Pixelframe: Settings</title>
<link rel="stylesheet" type="text/css" href="style.css" />
<script language="javascript" src="<?php print(PF_REL_INSTALL_DIR.'js/juice.js'); ?>" type="text/javascript" > </script>
<script language="javascript" src="settings.js" type="text/javascript" > </script>
</head>

<body>

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
include_once(PF_SCRIPTS_DIR."pf_configparser.php");

$cr = new ConfigReader(PF_CONFIG_FILE);
$pass = $cr->get("settings/password");
$pass = $pass['data'];


/* TODO : perform password checks here
 This is a fake check */
if(md5($_POST['pf-password']) == $pass) {
?>

<!--Control and Information Panels hidden -->
<div id="panel">
<a name="panel"></a>
<div id="success-panel">
<h2>Success!</h2>
</div>
<div id="error-panel">
<h2>Error!</h2>
</div>
<div id="loading-panel">
<img src="<?php print(PF_REL_IMAGES_DIR."loading.gif"); ?>" alt="Loading..."></img>
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
<h2>Edit <span id="album-name">album</span></h2>

<!--Album stats -->
<form id="album-edit-form" action="">
<div>
<label for="album-theme-selector">Change theme:</label>
<select id="album-theme-selector" name="album-theme-selector">
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
<p id="no-albums-message">It seems you don't have any albums yet. Click on "Add an Album" above to add one.</p>
<?php
include_once("../scripts/pf_constants.php");
include_once(PF_SCRIPTS_DIR."pf_configparser.php");

$cp = new ConfigReader(PF_CONFIG_FILE);
$albums = $cp->getChildren("settings/albums");
print('<ul id="album-list">');
if($albums) {
    foreach($albums as $album) {
        print('<li>'.$album['attributes']['name'].'</li>');
    }
}
print('</ul>');

?>



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
