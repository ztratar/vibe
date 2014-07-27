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
    			timeAgo: moment(this.model.get('time_updated')).fromNow()
    		};

    		if (this.model.get('data').num_people) {
    			templateDate.numPeopleString = this.getNumPeopleString(this.model.get('data').num_people);
    		}

    		var users = this.model.get('data').users,
    			firstUserId = this.model.get('data').first_user_id,
    			firstUser,
    			adhocSortedUsers;
    		if (users && users.length) {
    			users = _.filter(users, function(user) {
    				return (user._id !== window.Vibe.user.get('_id'));
    			});
    			users = _.compact(users);
    			firstUser = _.find(users, function(user) {
    				return user._id === firstUserId;
    			}) || users[0];

    			// Move first user to the 0th position
    			adhocSortedUsers = _.without(users, firstUser);
    			adhocSortedUsers = [firstUser].concat(adhocSortedUsers);

    			if (adhocSortedUsers.length) {
    				templateDate.peopleString = this.getUsersListString(adhocSortedUsers);
    			} else {
    				templateDate.peopleString = '';
    			}
    			templateDate.firstUserImg = firstUser.avatar;
    		}

    		this.$el.html(this.template(templateDate));

    		return this;
    	},

    	getUsersListString: function(users) {
    		var baseUserStr = ''

    		if (!users.length) return false;

    		if (users.length === 1) {
    			baseUserStr = users[0].name;
    		} else if (users.length === 2) {
    			baseUserStr = users[0].name + ' and ' + users[1].name;
    		} else if (users.length === 3) {
    			baseUserStr = users[0].name + ', ' + users[1].name + ', and ' + users[2].name;
    		} else {
    			baseUserStr = users[0].name + ', ' + users[1].name + ', and ' + (users.length-2) + ' others';
    		}

    		baseUserStr = '<strong>' + _.escape(baseUserStr) + '</strong>';
    		if (users.length > 1) {
    			return baseUserStr + ' are';
    		} else {
    			return baseUserStr + ' is';
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

    		var notifUrl = this.model.getActionUrl();

    		if (notifUrl) {
    			window.Vibe.cachedBackUrl = '/notifications';
    			window.Vibe.appRouter.navigate(notifUrl, {
    				trigger: true
    			});
    		}

    		return false;
    	}

    });

    __exports__["default"] = NotificationItemView;
  });