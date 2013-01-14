enyo.kind({
	name: "com.icottrell.looking_down.LocalStore",
	
	create: function() {
		this.inherited(arguments);
	},
	addStarCamera: function(inStore, inCamera, callback){
		var flag = true,
			store;

		this.retrieveItem(inStore, function(inSender, inResult){store = inResult;}, null);

		if(!store){
			store = [];
			store.push(inCamera);
			this.setItem(inStore, store);
		} else {
			
			for(i = 0; i < store.length; i++){
				if(inCamera.src === store[i].src ){
					flag = false;
					break;
				}
			}
			if(flag){
				store.push(inCamera);
				this.setItem(inStore, store);
			}
		}
		callback();
	},
	removeStarCamera: function(inStore, inCamera, callback){
		var i, store;

		this.retrieveItem(inStore, function(inSender, inResult){store = inResult;}, null);
		if(store) {
			for(i =0; i < store.length; i++){
				if(inCamera.src === store[i].src ){
					store = store.slice(0, i).concat(store.slice(i+1));
					break;
				}	
			}
			this.setItem(inStore, store);
		}
		callback();
	},
	containsStarCamera: function(inStore, inCamera) {
		var i, store;

		this.retrieveItem(inStore, function(inSender, inResult){ store = inResult; });
		if(store) {
			for(i=0; i< store.length; i++) {
				if(inCamera.src === store[i].src ) {
					return true;
				}
			}
		}
		return false;
	},
	setItem: function(key, value, sucessCallback, failCallback){
		try {
			
			var valString = JSON.stringify(value);
			var b64 = this.lzw_encode(valString);  //window.btoa(JSON.stringify(value));
			
			if (valString != null && b64 != null) {//} && value.length > 0  && b64.length > 0) {
				if (valString.length > 1000) {
					// don't bother reporting size deltas for small storage items
				}
            }
			
			if(typeof(Storage) !== "undefined") {
	  			if(localStorage) {
	  				localStorage.setItem(key, b64);
	  			} else if(Storage) {
	  				Storage[key] = 64;
	  			}
	  			if(sucessCallback){
	  				sucessCallback();
	  			}
	  		}
		} catch(e) {
		
			if(failCallback){
				failCallback();
			}
		}	
	},
	/**
	* Given a key, return the value associated with that key (or null) using callback structure
	* successCallback(inSender, inResult)  , failCallback()
	*/
	retrieveItem: function(key, sucessCallback, failCallback){
		var b64, value = null;
		
		
		try {
			if(typeof(Storage) !== "undefined") {
	  			if(localStorage) {
			  		b64 = localStorage.getItem(key);	
	  			} else if(Storage){
	  				b64 = Storage[key];
	  			}
	  		}
	  		if(b64) {
	  			value = JSON.parse(this.lzw_decode(b64)); //JSON.parse(window.atob(b64));
	  		}
	  		if(value !== null && value !== "undefined"){
	  			if(sucessCallback){
	  				sucessCallback(this, value);
	  			}
	  		} else {
		
	  			if(failCallback){
	  				failCallback();
	  			}
	  		}
		} catch(e) {
			logError("\tStore.js::retrieveItem( "+key+" ) - ERROR: "+e.message);
			if(failCallback) {
				failCallback();
			}
		}
	},
	getSetting: function(inSetting) {
		var value = null;
		this.retrieveItem(inSetting, function(inSender, inResult){ value  = inResult;});
		return value;
	},
	setSetting: function(inSetting, inValue) {
		this.setItem(inSetting, inValue);
		enyo.Signals.send("onSettingsUpdate");	
	},
		// LZW-compress a string
	lzw_encode: function (s) {
    	var dict = {};
	    var data = (s + "").split("");
	    var out = [];
	    var currChar;
	    var phrase = data[0];
	    var code = 256;
	    for (var i=1; i<data.length; i++) {
	        currChar=data[i];
	        if (dict[phrase + currChar] != null) {
	            phrase += currChar;
	        }
	        else {
	            out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
	            dict[phrase + currChar] = code;
	            code++;
	            phrase=currChar;
	        }
	    }
	    out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
	    for (var i=0; i<out.length; i++) {
	        out[i] = String.fromCharCode(out[i]);
	    }
	    return out.join("");
	},

	// Decompress an LZW-encoded string
	lzw_decode: function(s) {
	    var dict = {};
	    var data = (s + "").split("");
	    var currChar = data[0];
	    var oldPhrase = currChar;
	    var out = [currChar];
	    var code = 256;
	    var phrase;
	    for (var i=1; i<data.length; i++) {
	        var currCode = data[i].charCodeAt(0);
	        if (currCode < 256) {
	            phrase = data[i];
	        }
	        else {
	           phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
	        }
	        out.push(phrase);
	        currChar = phrase.charAt(0);
	        dict[code] = oldPhrase + currChar;
	        code++;
	        oldPhrase = phrase;
	    }
	    return out.join("");
	}
});