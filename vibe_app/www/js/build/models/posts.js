define("models/posts", 
  ["backbone","models/post","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Post = __dependency2__["default"];

    var Posts = Backbone.Collection.extend({

    	model: Post,

    	initialize: function() {
    		this.cached = [];
    	},

    	comparator: function(a,b) {
    		return (Date.parse(a.get('time_created')) < Date.parse(b.get('time_created'))) ? 1 : -1;
    	},

    	addCached: function(posts) {
    		if (posts) {
    			this.cached = this.cached.concat(posts);
    			this.trigger('cachedPostsChange');
    		}
    	},

    	loadCachedPosts: function() {
    		for (var i = 0; i < this.cached.length; i++) {
    			this.add(this.cached[i]);
    		}
    		this.cached = [];
    		this.trigger('cachedPostsChange');
    	},

    	getNew: function() {
    		var mostRecentModel = this.first(),
    			that = this;

    		if (!mostRecentModel) {
    			return false;
    		}

    		this.currentlyFetching = true;
    		this.trigger('currentlyFetching');
    		this.fetch({
    			url: this.url + '?afterId=' + mostRecentModel.get('_id'),
    			remove: false,
    			success: function() {
    				that.currentlyFetching = false;
    				that.trigger('fetchingDone');
    			}
    		});
    	},

    	getMore: function() {
    		var lastModel = this.last(),
    			that = this;

    		if (!lastModel) return false;

    		this.currentlyFetching = true;
    		this.trigger('currentlyFetching');
    		this.fetch({
    			url: this.url + '?beforeId=' + lastModel.get('_id'),
    			remove: false,
    			success: function(model, data) {
    				that.currentlyFetching = false;
    				that.trigger('fetchingDone');
    				if (!data.length) that.atLastItem = true
    			}
    		});
    	}

    });

    __exports__["default"] = Posts;
  });