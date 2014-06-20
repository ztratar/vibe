define("views/notificationItemView", 
  ["backbone","underscore","text!templates/notificationItemView.html","moment","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";

    var template = __dependency3__;
    var moment = __dependency4__;

    var NotificationItemView = Backbone.View.extend({

    	tagName: 'li',

    	className: 'notification-item-view',

    	template: _.template(template),

    	events: {
    		'click a': 'clicked'
    	},

    	initialize: function(opts) {
    		this.model = opts.model;
    		this.model.on('change', this.render, this);
    	},

    	render: function() {
    		var templateDate = {
    			model: this.model.toJSON(),
    			body: 'Test',
    			timeAgo: moment(this.model.get('time_updated')).fromNow()
    		};

    		if (this.model.get('data').num_people) {
    			templateDate.numPeopleString = this.getNumPeopleString(this.model.get('data').num_people);
    		}

    		this.$el.html(this.template(templateDate));

    		return this;
    	},

    	getUsersListString: function(users) {
    		if (!users.length) return false;

    		if (users.length === 1) {
    			return users[0].name;
    		} else if (users.length === 2) {
    			return users[0].name + ' and ' + users[1].name;
    		} else if (users.length === 3) {
    			return users[0].name + ', ' + users[1].name + ', and ' + users[2].name;
    		} else {
    			return users[0].name + ', ' + users[1].name + ', and ' + (users.length-2) + ' others';
    		}
    	},

    	getNumPeopleString: function(num) {
    		if (num === 1) {
    			return '1 person';
    		} else {
    			return num + ' people';
    		}
    	},

    	clicked: function() {
    		this.model.set('pseudoRead', false);
    		return false;
    	}

    });

    __exports__["default"] = NotificationItemView;
  });