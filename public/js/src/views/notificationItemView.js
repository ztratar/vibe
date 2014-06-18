import 'backbone';
import 'underscore';

module template from 'text!templates/notificationItemView.html';
module moment from 'moment';

var NotificationItemView = Backbone.View.extend({

	tagName: 'li',

	className: 'notification-item-view',

	template: _.template(template),

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
	}

});

export default = NotificationItemView;
