//(c) 2007 Nikhil Marathe (http://22bits.exofire.net). GNU GPL license.
//@version 0.1

//requires base.js and extensions.js

/* Adds a class for Ajax requests */
var Ajax = Class.create();
Object.extend(Ajax.prototype, {
    /**
     * Initialize creates an ajax and submits the request to the server
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
     *
     * Note: The onSuccess and onFailure functions will be passed the request object as the first arguments
     */
    initialize:function(url, parameters, extras) {
        this.URL = url;
        this.parameters = parameters;
        
        this.extras = Object.extend( {
            method:'get',
            onSuccess:function() {},
            onFailure:function() {},
            contentType:'application/x-www-form-urlencoded'
        }, extras);
        
        this.activate();
    },
    
    _getRequestObject:function() {
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
        
        return req;
    },
    
    _formatParameters: function() {
        var formatted = [];
        for(item in this.parameters)
            formatted.push(item + "=" + this.parameters[i]);
        return escape(formatted.join('&'));
    },
    
    activate:function() {
    }
});