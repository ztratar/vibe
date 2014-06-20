import 'backbone';
import Notification from 'models/notification';

var Notifications = Backbone.Collection.extend({

	model: Notification,

	comparator: function(a,b) {
		return (Date.parse(a.get('time_updated')) < Date.parse(b.get('time_updated'))) ? 1 : -1;
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
			url: this.url + '?afterTime=' + mostRecentModel.get('time_updated'),
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
			url: this.url + '?beforeTime=' + lastModel.get('time_updated'),
			remove: false,
			success: function(model, data) {
				that.currentlyFetching = false;
				that.trigger('fetchingDone');
				if (!data.length) that.atLastItem = true
			}
		});
	},

	unread: function() {
		return this.where({ read: false });
	},

	markAllRead: function() {
		var unread = this.where({ read: false });

		_.each(unread, function(unreadItem) {
			unreadItem.set({
				read: true,
				pseudoRead: true
			});
		});

		$.ajax({
			type: 'PUT',
			url: '/api/notifications/mark_read'
		});
	}

});

export default = Notifications;
