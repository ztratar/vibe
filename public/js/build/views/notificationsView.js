define("views/notificationsView", 
  ["backbone","underscore","views/notificationItemView","text!templates/notificationsView.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";

    var NotificationItemView = __dependency3__["default"];
    var template = __dependency4__;

    var NotificationsView = Backbone.View.extend({

    	className: 'notifications-view',

    	template: _.template(template),

    	initialize: function(opts) {
    		this.notifications = opts.notifications;
    		this.notifications.on('reset', this.addAll, this);
    		this.notifications.on('sort', this.addAll, this);
    		this.notifications.on('add', this.addOne, this);
    	},

    	render: function() {
    		this.$el.html(this.template());
    		this.$notifList = this.$('.notifications-list');

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

    		if (this.notifications.indexOf(notif) === 0) {
    			this.$notifList.prepend(notifView.$el);
    		} else {
    			this.$notifList.append(notifView.$el);
    		}
    		notifView.render();
    	}

    });

    __exports__["default"] = NotificationsView;
  });