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
_ArrayExtension={each:function(_9){
for(var i=0;i<this.length;i++){
_9(this[i]);
}
},last:function(){
return this[this.length-1];
},indexOf:function(_b){
for(var i=0;i<this.length;i++){
if(_b==this[i]){
return i;
}
}
return -1;
}};
Object.extend(Array.prototype,_ArrayExtension);
_NumExtension={times:function(_d){
if(this<=0){
return;
}
for(var i=1;i<=this;i++){
_d();
}
},toColourPart:function(){
if(this<=255){
return this.toHex();
}
},toHex:function(){
var _f=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
var _10=this%16;
var _11=(this-_10)/16;
return _f[_11]+_f[_10];
}};
Object.extend(Number.prototype,_NumExtension);
Object.extend(String.prototype,{camelize:function(){
var ar=this.split("-");
var ret=ar[0];
for(var i=1;i<ar.length;i++){
ret+=ar[i].charAt(0).toUpperCase()+ar[i].substring(1);
}
return ret;
},_Dec:function(){
var _15=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
var ret=0;
for(var i=0;i<this.length;++i){
ret=ret*16+_15.indexOf(this.charAt(i).toLowerCase());
}
return ret;
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
function getElementsByClassName(_1c){
elements=document.getElementsByTagName("*");
var ret=[];
$A(elements).each(function(el){
if($(el).hasClassName(_1c)){
ret.push(el);
}
});
return ret;
}
if(!window.Element){
Element=Class.create();
}
CustomElement=Class.create();
Object.extend(CustomElement.prototype,{remove:function(){
this.parentNode.removeChild(this);
},getClassNames:function(){
return this.className.split(" ");
},hasClassName:function(_1f){
return this.getClassNames().join(" ").match("\\b"+_1f+"\\b");
},addClass:function(_20){
if(!this.hasClassName(_20)){
this.className+=" "+_20;
}
return this;
},removeClass:function(_21){
classNm=this.hasClassName(_21);
if(classNm){
this.className=this.getClassNames().join(" ").replace(classNm,"");
}
return this;
},addNodes:function(_22){
__realThis=this;
_22.each(function(el){
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
},setStyle:function(_24){
for(property in _24){
this.style[property.camelize()]=_24[property];
}
return this;
},getStyle:function(_25){
var ret=this.style[_25.camelize()];
if(!ret){
if(document.defaultView&&document.defaultView.getComputedStyle){
ret=document.defaultView.getComputedStyle(this,null).getPropertyValue(_25.camelize());
}else{
if(element.currentStyle){
ret=element.currentStyle[_25.camelize()];
}
}
}
return ret;
},getDimensions:function(){
var _27=this.parentNode.offsetWidth-this.offsetWidth;
var top=this.parentNode.offsetHeight-this.offsetHeight;
var w=this.clientWidth;
var h=this.clientHeight;
if(this.getStyle("display")=="none"){
var _2b=this.visibility;
var _2c=this.position;
this.visibility="hidden";
this.position="absolute";
this.setStyle({display:""});
_27=this.parentNode.offsetWidth-this.offsetWidth;
top=this.parentNode.offsetHeight-this.offsetHeight;
w=this.clientWidth;
h=this.clientHeight;
this.visibility=_2b;
this.position=_2c;
this.setStyle({display:"none"});
}
return {x:_27,y:top,width:w,height:h};
},addEvent:function(_2d,_2e,_2f){
if(window.addEventListener){
this.addEventListener(_2d,_2e,_2f);
}else{
this.attachEvent(_2d,_2e);
}
},removeEvent:function(_30,_31,_32){
if(window.addEventListener){
this.removeEventListener(_30,_31,_32);
}else{
this.detachEvent("on"+_30,_31);
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
Event=Class.create();
Object.extend(Event,{eventList:false,push:function(_36){
if(!this.eventList){
this.eventList=[];
}
this.eventList.push(_36);
},unloadAll:function(){
if(!this.eventList){
return;
}
$A(this.eventList).each(function(_37){
_37[0].removeEvent(_37[1],_37[2],_37[3]);
_37[0]=null;
});
}});
$(window).addEvent("unload",Event.unloadAll,false);
var Ajax=Class.create();
Object.extend(Ajax.prototype,{requestObject:null,initialize:function(url,_39,_3a){
this.URL=url;
this.parameters=_39;
this.extras=Object.extend({method:"get",onSuccess:function(){
},onFailure:function(){
},contentType:"application/x-www-form-urlencoded",payload:null,async:true,immediate:true},_3a);
if(this.extras.immediate){
this.activate();
}
},_createRequestObject:function(){
var req=null;
try{
req=new XMLHttpRequest();
}
catch(e){
try{
req=new ActiveXObject("Msxml2.XMLHTTP");
}
catch(e){
try{
req=new ActiveXObject("Microsoft.XMLHTTP");
}
catch(e){
req=null;
}
}
}
if(req==null){
alert("Could not create Ajax object");
}
this.requestObject=req;
},_formatParameters:function(){
var _3c=[];
for(item in this.parameters){
_3c.push(item+"="+this.parameters[item]);
}
return _3c.join("&");
},activate:function(){
this._createRequestObject();
if(!this.requestObject){
alert("Request object not created");
}
var _3d=this.URL;
if(this.extras.method=="get"){
params=this._formatParameters();
params+="&random="+Math.random();
_3d+="?"+params;
}
this.requestObject.open(this.extras.method,_3d,this.extras.async);
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
Effects=Class.create();
Effects.Transitions={linear:function(t,b,c,d){
return (c*t/d+b);
},sinusoidal:function(t,b,c,d){
return c/2*(1-Math.cos(Math.PI*t/d))+b;
},quadratic:function(t,b,c,d){
return c*(t/=d)*t+b;
}};
Effects.Base=function(){
};
Object.extend(Effects.Base.prototype,{effectDone:false,setOptions:function(_4a){
this.options=Object.extend({onStart:function(){
},onComplete:function(){
},duration:1000,fps:50,transition:Effects.Transitions.sinusoidal},_4a);
},_step:function(){
var _4b=new Date().getTime();
if(_4b<=this.startTime+this.options.duration){
this.elapsedTime=_4b-this.startTime;
this._setNow();
}else{
setTimeout(this.options.onComplete.bind(this.element),10);
this._resetTimer();
this.startTime=0;
}
this.update();
},activate:function(_4c,to){
return this._start(_4c,to);
},_start:function(_4e,to){
if(this.timer){
return;
}
setTimeout(this.options.onStart.bind(this.element),10);
this.from=_4e;
this.to=to;
this.startTime=new Date().getTime();
this.timer=setInterval(this._step.bind(this),Math.round(1000/this.options.fps));
return this;
},_setNow:function(){
this.now=this.compute(this.from,this.to);
},compute:function(_50,to){
return this.options.transition(this.elapsedTime,_50,to-_50,this.options.duration);
},_resetTimer:function(){
clearInterval(this.timer);
this.timer=null;
},toggle:function(){
this._resetTimer();
this.activate(this.to,this.from);
}});
Effects.Multiple=function(){
};
Object.extend(Object.extend(Effects.Multiple.prototype,new Effects.Base()),{activate:function(_52,to){
frm={};
Object.extend(frm,_52);
t={};
Object.extend(t,to);
this.now={};
this._start(frm,t);
},_setNow:function(){
for(p in this.from){
var _54=this.compute(this.from[p],this.to[p]);
this.now[p]=_54;
}
}});
Effects.Move=Class.create();
Object.extend(Object.extend(Effects.Move.prototype,new Effects.Multiple()),{initialize:function(el){
this.element=$(el);
this.setOptions(arguments[1]);
oLeft=parseFloat(this.element.getStyle("left")||this.element.offsetLeft);
oTop=parseFloat(this.element.getStyle("top")||this.element.offsetTop);
if(this.options.mode=="absolute"){
this.options.x=this.options.x-oLeft;
this.options.y=this.options.y-oTop;
}
this.now={};
this.activate({x:oLeft,y:oTop},{x:this.options.x,y:this.options.y});
},update:function(){
this.element.setStyle({left:Math.round(this.now["x"]),top:Math.round(this.now["y"])});
}});
function _restoreSize(_56,w,h){
console.log(_56,w,h);
$(_56).setStyle({width:w+"px",height:h+"px"});
}
Effects.Width=Class.create();
Object.extend(Object.extend(Effects.Width.prototype,new Effects.Base()),{initialize:function(el){
this.element=$(el);
this.setOptions(arguments[1]);
this.element.setStyle({overflow:"hidden"});
this.activate(parseInt((this.element.getStyle("width")||this.element.offsetWidth)),this.options.width);
},update:function(){
console.log(this.now);
this.element.setStyle({width:Math.round(this.now)+"px"});
}});
Effects.Height=Class.create();
Object.extend(Object.extend(Effects.Height.prototype,new Effects.Base()),{initialize:function(el){
this.element=$(el);
this.setOptions(arguments[1]);
this.element.setStyle({overflow:"hidden"});
this.activate(parseInt((this.element.getStyle("height")||this.element.offsetHeight)),this.options.height);
},update:function(){
this.element.setStyle({height:Math.round(this.now)+"px"});
}});
Effects.Opacity=Class.create();
Object.extend(Object.extend(Effects.Opacity.prototype,new Effects.Base()),{initialize:function(el){
this.element=$(el);
this.setOptions(arguments[1]);
this.activate(parseFloat(this.element.getStyle("opacity")||"1.0"),this.options.opacity||0);
},update:function(){
this.element.setStyle({opacity:this.now,filter:"alpha(opacity="+this.now*20+")"});
}});
Effects.Colour=Class.create();
Object.extend(Object.extend(Effects.Colour.prototype,new Effects.Multiple()),{initialize:function(el,_5d){
this.element=$(el);
this.style=_5d;
this.setOptions(Object.extend({startColour:"#000",endColour:"#fff",duration:2000},arguments[2]));
var _5e=this.options.startColour.RGB();
var _5f=this.options.endColour.RGB();
this.activate(_5e,_5f);
},update:function(){
var _60="#";
for(val in this.now){
_60+=Math.ceil(this.now[val]).toHex();
}
eval("this.element.setStyle({"+this.style.camelize()+":'"+_60+"'})");
}});
Effects.Custom=Class.create();
Object.extend(Object.extend(Effects.Custom.prototype,new Effects.Base()),{initialize:function(el,_62,_63,end){
this.element=$(el);
this.style=_62;
this.setOptions(Object.extend({units:"px"},arguments[4]));
this.element.setStyle({style:_63+"px"});
this.activate(_63,end);
},update:function(){
eval("this.element.setStyle({"+this.style.camelize()+":Math.ceil("+this.now+")+'"+this.options.units+"'})");
}});
Effects.Highlight=function(el){
new Effects.Colour(el,"background-color",Object.extend(arguments[1]||{},{startColour:"#FFE373",endColour:$(el).getStyle("background-color")||"#fff"}));
};
Effects.Appear=function(el){
element=$(el);
element.setStyle({opacity:0});
new Effects.Opacity(element,Object.extend({opacity:1},arguments[1]));
};
Effects.Fade=function(el){
element=$(el);
element.setStyle({opacity:1});
new Effects.Opacity(element,Object.extend({opacity:0},arguments[1]));
};
Effects.Shrink=function(el){
new Effects.Width(el,Object.extend({width:0},this.options));
new Effects.Height(el,Object.extend({height:0},this.options));
};
Effects.BlindDown=function(el){
$(el).setStyle({overflow:"hidden"});
var ht=$(el).getDimensions().height;
$(el).setStyle({height:0});
new Effects.Height(el,Object.extend({height:ht},arguments[1]));
};
Effects.BlindUp=function(el){
$(el).setStyle({overflow:"hidden"});
new Effects.Height(el,Object.extend({height:0},arguments[1]));
};
Effects.SlideIn=function(el){
$(el).setStyle({overflow:"hidden"});
new Effects.Width(el,Object.extend({width:0},arguments[1]));
};
Effects.SlideOut=function(el){
$(el).setStyle({overflow:"hidden"});
var wt=$(el).getDimensions().width;
$(el).setStyle({width:0});
new Effects.Width(el,Object.extend({width:wt},arguments[1]));
};
Effects.Drop=function(el){
new Effects.Move(el,{y:100,duration:200,onComplete:function(){
this.remove();
}});
new Effects.Fade(el,{duration:150});
};

