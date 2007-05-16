var URL="request.php";
var LOADING_IMAGE="../images/loading-client.gif";
var pf_originalImage="";
var pf_loadedThumbnails=[];
function baseName(_1){
var _2=_1.lastIndexOf("/");
return (_2>=0?_1.substring(_2+1):_1);
}
function setLoading(){
pf_originalImage=$("main-image").src;
$("main-image").src=LOADING_IMAGE;
}
function goodStatus(_3){
var _4=_3.getElementsByTagName("status")[0];
if(_4){
_4=_4.firstChild.nodeValue;
return _4=="success";
}
}
function error(_5){
alert("There was an error in fetching the image");
}
function setImage(_6){
$("main-image").src=(goodStatus(_6.responseXML)?_6.responseXML.getElementsByTagName("image")[0].firstChild.nodeValue:pf_originalImage);
$A($("thumbnail-view").getElementsByTagName("img")).each(function(_7){
_7.id="";
if(baseName(_7.src)==baseName($("main-image").src)){
_7.id="current";
}
});
}
function setThumbnailAsImage(_8){
if(_8){
Event.stopDefault(_8);
}
var _9=this.src;
setLoading();
new Ajax(URL,{action:"setthumbnail",thumbnail:_9},{onSuccess:function(_a){
if(goodStatus(_a.responseXML)){
setImage(_a);
}
},onFailure:error});
}
function nextImage(_b){
if(_b){
Event.stopDefault(_b);
}
setLoading();
new Ajax(URL,{action:"next"},{onSuccess:setImage,onFailure:error});
}
function prevImage(_c){
if(_c){
Event.stopDefault(_c);
}
setLoading();
new Ajax(URL,{action:"previous"},{onSuccess:setImage,onFailure:error});
}
function setup(){
$("next-button").addEvent("click",nextImage,false);
$("next-button").href="";
$("prev-button").addEvent("click",prevImage,false);
$("prev-button").href="";
$A($("thumbnail-view").getElementsByTagName("img")).each(function(_d){
$(_d).addEvent("click",setThumbnailAsImage,false);
_d.parentNode.href="";
});
}
window.addEvent("load",setup,false);

