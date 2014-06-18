define("models/notifications", 
  ["backbone","models/notification","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Notification = __dependency2__["default"];

    var Notifications = Backbone.Collection.extend({

    	model: Notification,

    	comparator: function(a,b) {
    		return Date.parse(a.get('time_updated')) < Date.parse(b.get('time_updated'));
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
    	},

    	markAllRead: function() {
    		$.ajax({
    			type: 'PUT',
    			url: '/api/notifications/mark_read'
    		});
    	}

    });

    __exports__["default"] = Notifications;
  });