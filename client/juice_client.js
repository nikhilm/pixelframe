Object.extend=function(_1,_2){
for(property in _2){
_1[property]=_2[property];
}
return _1;
};
Class={create:function(){
return function(){
this.initialize.apply(this,arguments);
};
}};
Function.prototype.bind=function(_3){
var _4=this;
return function(){
_4.apply(_3,arguments);
};
};
function debug(_5){
alert(_5);
}
function $A(_6){
var _7=[];
for(var i=0;i<_6.length;i++){
_7.push(_6[i]);
}
return _7;
}

_ArrayExtension={each:function(_1){
for(var i=0;i<this.length;i++){
_1(this[i]);
}
},last:function(){
return this[this.length-1];
},indexOf:function(_3){
for(var i=0;i<this.length;i++){
if(_3==this[i]){
return i;
}
}
return -1;
}};
Object.extend(Array.prototype,_ArrayExtension);
_NumExtension={times:function(_5){
if(this<=0){
return;
}
for(var i=1;i<=this;i++){
_5();
}
},toColourPart:function(){
if(this<=255){
return this.toHex();
}
},toHex:function(){
var _7=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
var _8=this%16;
var _9=(this-_8)/16;
return _7[_9]+_7[_8];
}};
Object.extend(Number.prototype,_NumExtension);
Object.extend(String.prototype,{camelize:function(){
var ar=this.split("-");
var _b=ar[0];
for(var i=1;i<ar.length;i++){
_b+=ar[i].charAt(0).toUpperCase()+ar[i].substring(1);
}
return _b;
},_Dec:function(){
var _d=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
var _e=0;
for(var i=0;i<this.length;++i){
_e=_e*16+_d.indexOf(this.charAt(i).toLowerCase());
}
return _e;
},HEX:function(){
var ret="#";
if(this.substr(0,4)=="rgb("){
colours=this.RGB();
[colours.r,colours.g,colours.b].each(function(col){
ret+=col.toColourPart();
});
}else{
if(this.charAt(0)=="#"){
if(this.length==4){
sub=this.substring(1);
ret+=sub+sub;
}else{
ret=this;
}
}
}
return (ret=="#"?null:ret);
},RGB:function(){
var rgb={r:0,g:0,b:0};
if(this.substr(0,4)=="rgb("){
colours=this.substring(4,this.length-1).split(",");
rgb.r=parseInt(colours[0]);
rgb.g=parseInt(colours[1]);
rgb.b=parseInt(colours[2]);
}else{
if(this.charAt(0)=="#"){
var hex=this.HEX();
hex=hex.substring(1);
rgb.r=hex.substring(0,2)._Dec();
rgb.g=hex.substring(2,4)._Dec();
rgb.b=hex.substring(4)._Dec();
}
}
return rgb;
}});

function getElementsByClassName(_1){
elements=document.getElementsByTagName("*");
var _2=[];
$A(elements).each(function(el){
if($(el).hasClassName(_1)){
_2.push(el);
}
});
return _2;
}
if(!window.Element){
Element=Class.create();
}
CustomElement=Class.create();
Object.extend(CustomElement.prototype,{remove:function(){
this.parentNode.removeChild(this);
},getClassNames:function(){
return this.className.split(" ");
},hasClassName:function(_4){
return this.getClassNames().join(" ").match("\\b"+_4+"\\b");
},addClass:function(_5){
if(!this.hasClassName(_5)){
this.className+=" "+_5;
}
return this;
},removeClass:function(_6){
classNm=this.hasClassName(_6);
if(classNm){
this.className=this.getClassNames().join(" ").replace(classNm,"");
}
return this;
},addNodes:function(_7){
__realThis=this;
_7.each(function(el){
__realThis.appendChild(el);
});
return this;
},removeNodes:function(){
if(this.hasChildNodes()){
while(this.hasChildNodes()){
this.removeChild(this.firstChild);
}
}
return this;
},setStyle:function(_9){
for(property in _9){
this.style[property.camelize()]=_9[property];
}
return this;
},getStyle:function(_a){
var _b=this.style[_a.camelize()];
if(!_b){
if(document.defaultView&&document.defaultView.getComputedStyle){
_b=document.defaultView.getComputedStyle(this,null).getPropertyValue(_a.camelize());
}else{
if(this.currentStyle){
_b=this.currentStyle[_a.camelize()];
}
}
}
return _b;
},getDimensions:function(){
function get(_c){
var _d=_c.parentNode.offsetWidth-_c.offsetWidth;
var _e=_c.parentNode.offsetHeight-_c.offsetHeight;
var w=parseInt(_c.getStyle("width"))||_c.offsetWidth;
var h=parseInt(_c.getStyle("height"))||_c.offsetHeight;
return {x:_d,y:_e,width:w,height:h};
}
if(this.getStyle("display")=="none"){
var _11=this.visibility;
var _12=this.position;
this.visibility="hidden";
this.position="absolute";
this.setStyle({display:"block"});
var ret=get(this);
this.visibility=_11;
this.position=_12;
this.setStyle({display:"none"});
return ret;
}
return get(this);
},addEvent:function(_14,_15,_16){
Events.push([this,_14,_15,_16]);
if(window.addEventListener){
this.addEventListener(_14,_15,_16);
}else{
this.attachEvent("on"+_14,_15.bind(this));
}
},removeEvent:function(_17,_18,_19){
if(window.addEventListener){
this.removeEventListener(_17,_18,_19);
}else{
this.detachEvent("on"+_17,_18.bind(this));
}
}});
Object.extend(Element,CustomElement.prototype);
function $(){
if(arguments.length==1){
return getElem(arguments[0]);
}
var ret=[];
$A(arguments).each(function(el){
ret.push(getElem(el));
});
function getElem(el){
if(typeof el=="string"){
el=document.getElementById(el);
}
return (el?Object.extend(el,CustomElement.prototype):false);
}
return ret;
}
if(!window.Event){
var Event=Class.create();
}
Object.extend(Event,{stopEvent:function(_1d){
if(_1d.stopPropagation){
_1d.stopPropagation();
}else{
_1d.cancelBubble=true;
}
},stopDefault:function(_1e){
if(_1e.preventDefault){
_1e.preventDefault();
}else{
_1e.returnValue=false;
}
}});
var Events=Class.create();
Object.extend(Events,{eventList:false,push:function(_1f){
if(!this.eventList){
this.eventList=[];
}
this.eventList.push(_1f);
},unloadAll:function(){
if(!this.eventList){
return;
}
$A(this.eventList).each(function(_20){
_20[0].removeEvent(_20[1],_20[2],_20[3]);
_20[0]=null;
});
}});
$(window).addEvent("unload",Events.unloadAll,false);

var Ajax=Class.create();
Object.extend(Ajax.prototype,{requestObject:null,initialize:function(_1,_2,_3){
this.URL=_1;
this.parameters=_2;
this.extras=Object.extend({method:"get",onSuccess:function(){
},onFailure:function(){
},contentType:"application/x-www-form-urlencoded",payload:null,async:true,immediate:true},_3);
if(this.extras.immediate){
this.activate();
}
},_createRequestObject:function(){
var _4=null;
try{
_4=new XMLHttpRequest();
}
catch(e){
try{
_4=new ActiveXObject("Msxml2.XMLHTTP");
}
catch(e){
try{
_4=new ActiveXObject("Microsoft.XMLHTTP");
}
catch(e){
_4=null;
}
}
}
if(_4==null){
alert("Could not create Ajax object");
}
this.requestObject=_4;
},_formatParameters:function(){
var _5=[];
for(param in this.parameters){
_5.push(param+"="+this.parameters[param]);
}
return _5.join("&");
},activate:function(){
this._createRequestObject();
if(!this.requestObject){
alert("Request object not created");
}
var _6=this.URL;
if(this.extras.method=="get"){
params=this._formatParameters();
params+="&random="+Math.random();
_6+="?"+params;
}
this.requestObject.open(this.extras.method,_6,this.extras.async);
this.requestObject.onreadystatechange=this._handleStateChange.bind(this);
if(this.extras.method=="post"){
this.requestObject.setRequestHeader("Content-Type",this.extras.contentType);
}
this.requestObject.send(this.extras.payload);
},_handleStateChange:function(){
if(!this.requestObject){
alert("Request object not created");
}
if(this.requestObject.readyState==4){
if(this.requestObject.status==200){
this.extras.onSuccess(this.requestObject);
}else{
this.extras.onFailure(this.requestObject);
}
}
}});

