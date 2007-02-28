<!---Add password checking code here -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<title>Pixelframe: Settings</title>
<link rel="stylesheet" type="text/css" href="style.css" />
<script language="javascript" src="../js/base.js" />
<script language="javascript" src="../js/dom.js" />
<script language="javascript" src="../js/extension.js" />
<script language="javascript" src="../js/effects.js" />
<script language="javascript" src="settings.js" />
</head>
<body onload="setup()">

<div id="wrapper">
<div id="header">
<img src="../logo_icon.png" />
Settings
</div>

<div id="content">

<!--Control and Information Panels hidden -->
<div id="panel">
<div id="success-panel">
<h2>Success!</h2>
</div>
<div id="error-panel">
<h2>Error!</h2>
</div>
<div id="edit-panel">
<h2 id="album-title">Edit album</h2>

<!--Album stats -->
<form id="album-edit-form">
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
<input type="button" value="Save changes" id="album-save" />
</div>

<div style="border-top:inset 1px #000;margin-top:50px;">
<!--Delete-->
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

<h3>Albums</h3>
<p>Select an Album below to change its settings:</p>
<!--= getFormattedAlbumList(); -->
<ul id="album-list">
        <li>Album 1</li>
        <li>Album 2</li>
        <li>Europe pics</li>
</ul>

<h3>Change password</h3>
<div id="password-div">
<div>
<label for="password-input">New Password:</label><input id="password-input" type="password"/>
</div>
<div>
<label for="password-confirm-input">Confirm Password:</label><input id="password-confirm-input" type="password" />
</div>

<input type="button" value="Change password" id="password-change-button" />

</div>
</div>


</div>

</body>
</html>
