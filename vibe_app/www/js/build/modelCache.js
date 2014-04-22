define("modelCache", 
  ["underscore","exports"],
  function(__dependency1__, __exports__) {
    "use strict";

    var ModelCache = function () {};

    _.extend(ModelCache.prototype, {
    	cache: {},
    	clear: function() {
    		this.cache = {};
    	},
    	set: function(key, val) {
    		this.cache[key] = val;
    	},
    	getAndRemove: function(key) {
    		var cacheVal = this.cache[key] || false;
    		delete this.cache[key];
    		return cacheVal;
    	},
    	get: function(key) {
    		if (this.cache[key]) {
    			return this.cache[key];
    		} else {
    			return false;
    		}
    	}
    });

    __exports__["default"] = ModelCache;
  });