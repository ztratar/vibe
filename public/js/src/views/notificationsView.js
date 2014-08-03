import 'backbone';
import 'underscore';

import NotificationItemView from 'views/notificationItemView';
module template from 'text!templates/notificationsView.html';

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
		this.$emptyState = this.$('.notification-empty-state');

		this.determineEmptyState();

		return this;
	},

	determineEmptyState: function() {
		if (this.notifications.length) {
			this.$emptyState.hide();
			this.$notifList.empty();
			this.$notifList.show();
		} else {
			this.$notifList.hide();
			this.$emptyState.show();
		}
	},

	addAll: function() {
		this.determineEmptyState();
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

export default = NotificationsView;
