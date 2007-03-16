//(c) 2007 Nikhil Marathe (http://22bits.exofire.net). GNU GPL license.
//@version 0.1

//requires base.js and extensions.js

/* Adds a class for Ajax requests */
/**
     * creates an ajax and submits the request to the server
     * It accepts the following arguments
     * @param url String The URL to connect to
     * @param parameters Object An object specifying the parameters to pass to the URL
     *                   in key:value pairs. NOTE:(This is only for GET requests)
     * @param extras Object Extra settings may include
     *          
     *              method: 'get' or 'post' (Default:'get')
     *              onSuccess: Function
     *              onFailure: Function
     *              payload: The payload data in case of post
     *              contentType: The content type for post data. (Default:application/x-www-form-urlencoded)
     *              async: true/false (Default:true)
     *              immediate: true/false (Default:true)
     *
     * Note: The onSuccess and onFailure functions will be passed the request object as the first arguments
     */
var Ajax = Class.create();
Object.extend(Ajax.prototype, {
    requestObject:null,
    
    initialize:function(url, parameters, extras) {
        this.URL = url;
        this.parameters = parameters;
        
        this.extras = Object.extend( {
            method:'get',
            onSuccess:function() {},
            onFailure:function() {},
            contentType:'application/x-www-form-urlencoded',
            payload:null,
            async:true,
            immediate:true
        }, extras);
        
        if(this.extras.immediate) this.activate();
    },
    
    _createRequestObject:function() {
        var req = null;
        try {
            req = new XMLHttpRequest();
        } catch(e) {
            try {
                req = new ActiveXObject("Msxml2.XMLHTTP");
            } catch(e) {
                try {
                    req = new ActiveXObject("Microsoft.XMLHTTP");
                } catch(e) {
                    req = null;
                }
            }
        }
        
        if(req == null)
            alert("Could not create Ajax object");
        
        this.requestObject = req;
    },
    
    _formatParameters: function() {
        var formatted = [];
        for(item in this.parameters)
            formatted.push(item + "=" + this.parameters[item]);
        return formatted.join('&');
    },
    
    activate:function() {
        this._createRequestObject();
        if(!this.requestObject) alert("Request object not created");
        var completeURL = this.URL;
        if(this.extras.method == 'get') {
            params = this._formatParameters();
            //prevent caching in IE
            params += "&random="+Math.random();
            
            completeURL += "?"+params;
        }      
        
        
        this.requestObject.open(this.extras.method, completeURL, this.extras.async);
        
        this.requestObject.onreadystatechange = this._handleStateChange.bind(this);
        if(this.extras.method == 'post') {
            this.requestObject.setRequestHeader('Content-Type', this.extras.contentType);
        }
        
        this.requestObject.send(this.extras.payload);
    },
    
    _handleStateChange:function() {
        if(!this.requestObject) alert("Request object not created");
        if(this.requestObject.readyState == 4) {
            if(this.requestObject.status == 200) {
                this.extras.onSuccess(this.requestObject);
            }
            else {
                this.extras.onFailure(this.requestObject);
            }
        }
    }
});