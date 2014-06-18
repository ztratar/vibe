define("views/notificationsView", 
  ["backbone","underscore","models/notifications","views/notificationItemView","text!templates/notificationsView.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __exports__) {
    "use strict";

    var Notifications = __dependency3__["default"];
    var NotificationItemView = __dependency4__["default"];
    var template = __dependency5__;

    var NotificationsView = Backbone.View.extend({

    	className: 'notifications-view',

    	template: _.template(template),

    	initialize: function() {
    		this.notifications = new Notifications();
    		this.notifications.url = '/api/notifications';

    		this.notifications.on('reset', this.addAll, this);
    		this.notifications.on('add', this.addOne, this);
    	},

    	render: function() {
    		this.$el.html(this.template());
    		this.$notifList = this.$('.notifications-list');

    		_.defer(_.bind(function() {
    			this.notifications.fetch({
    				reset: true
    			});
    		}, this));

    		return this;
    	},

    	addAll: function() {
    		this.$notifList.empty();
    		this.notifications.each(this.addOne, this);
    	},

    	addOne: function(notif) {
    		var notifView = new NotificationItemView({
    			model: notif
    		});

    		this.$notifList.append(notifView.$el);
    		notifView.render();
    	}

    });

    __exports__["default"] = NotificationsView;
  });