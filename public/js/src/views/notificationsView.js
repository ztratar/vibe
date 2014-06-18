import 'backbone';
import 'underscore';

import Notifications from 'models/notifications';
import NotificationItemView from 'views/notificationItemView';
module template from 'text!templates/notificationsView.html';

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
			this.notifications.markAllRead();
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

export default = NotificationsView;
