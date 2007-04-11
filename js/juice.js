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
var _c=this.parentNode.offsetWidth-this.offsetWidth;
var _d=this.parentNode.offsetHeight-this.offsetHeight;
var w=this.clientWidth;
var h=this.clientHeight;
if(this.getStyle("display")=="none"){
var _10=this.visibility;
var _11=this.position;
this.visibility="hidden";
this.position="absolute";
this.setStyle({display:""});
_c=this.parentNode.offsetWidth-this.offsetWidth;
_d=this.parentNode.offsetHeight-this.offsetHeight;
w=this.clientWidth;
h=this.clientHeight;
this.visibility=_10;
this.position=_11;
this.setStyle({display:"none"});
}
return {x:_c,y:_d,width:w,height:h};
},addEvent:function(_12,_13,_14){
Events.push([this,_12,_13,_14]);
if(window.addEventListener){
this.addEventListener(_12,_13,_14);
}else{
this.attachEvent("on"+_12,_13);
}
},removeEvent:function(_15,_16,_17){
if(window.addEventListener){
this.removeEventListener(_15,_16,_17);
}else{
this.detachEvent("on"+_15,_16.bind(this));
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
Object.extend(Event,{stopEvent:function(_1b){
if(_1b.stopPropagation){
_1b.stopPropagation();
}
_1b.cancelBubble=true;
},stopDefault:function(_1c){
if(_1c.preventDefault){
_1c.preventDefault();
}
_1c.returnValue=false;
}});
var Events=Class.create();
Object.extend(Events,{eventList:false,push:function(_1d){
if(!this.eventList){
this.eventList=[];
}
this.eventList.push(_1d);
},unloadAll:function(){
if(!this.eventList){
return;
}
$A(this.eventList).each(function(_1e){
_1e[0].removeEvent(_1e[1],_1e[2],_1e[3]);
_1e[0]=null;
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
Object.extend(Effects.Base.prototype,{effectDone:false,setOptions:function(_d){
this.options=Object.extend({onStart:function(){
},onComplete:function(){
},duration:1000,fps:50,transition:Effects.Transitions.sinusoidal},_d);
},_step:function(){
var _e=new Date().getTime();
if(_e<=this.startTime+this.options.duration){
this.elapsedTime=_e-this.startTime;
this._setNow();
}else{
setTimeout(this.options.onComplete.bind(this.element),10);
this._resetTimer();
this.startTime=0;
}
this.update();
},activate:function(_f,to){
return this._start(_f,to);
},_start:function(_11,to){
if(this.timer){
return;
}
setTimeout(this.options.onStart.bind(this.element),10);
this.from=_11;
this.to=to;
this.startTime=new Date().getTime();
this.timer=setInterval(this._step.bind(this),Math.round(1000/this.options.fps));
return this;
},_setNow:function(){
this.now=this.compute(this.from,this.to);
},compute:function(_13,to){
return this.options.transition(this.elapsedTime,_13,to-_13,this.options.duration);
},_resetTimer:function(){
clearInterval(this.timer);
this.timer=null;
},toggle:function(){
this._resetTimer();
this.activate(this.to,this.from);
}});
Effects.Multiple=function(){
};
Object.extend(Object.extend(Effects.Multiple.prototype,new Effects.Base()),{activate:function(_15,to){
frm={};
Object.extend(frm,_15);
t={};
Object.extend(t,to);
this.now={};
this._start(frm,t);
},_setNow:function(){
for(p in this.from){
var _17=this.compute(this.from[p],this.to[p]);
this.now[p]=_17;
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
function _restoreSize(_19,w,h){
console.log(_19,w,h);
$(_19).setStyle({width:w+"px",height:h+"px"});
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
Object.extend(Object.extend(Effects.Colour.prototype,new Effects.Multiple()),{initialize:function(el,_20){
this.element=$(el);
this.style=_20;
this.setOptions(Object.extend({startColour:"#000",endColour:"#fff",duration:2000},arguments[2]));
var _21=this.options.startColour.RGB();
var _22=this.options.endColour.RGB();
this.activate(_21,_22);
},update:function(){
var _23="#";
for(val in this.now){
_23+=Math.ceil(this.now[val]).toHex();
}
eval("this.element.setStyle({"+this.style.camelize()+":'"+_23+"'})");
}});
Effects.Custom=Class.create();
Object.extend(Object.extend(Effects.Custom.prototype,new Effects.Base()),{initialize:function(el,_25,_26,end){
this.element=$(el);
this.style=_25;
this.setOptions(Object.extend({units:"px"},arguments[4]));
this.element.setStyle({style:_26+"px"});
this.activate(_26,end);
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

