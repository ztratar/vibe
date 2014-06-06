import 'backbone';
import 'underscore';

import User from 'models/user';

module template from 'text!templates/userListInviteView.html';
module userListInviteItemTemplate from 'text!templates/userListInviteItem.html';

var UserListInviteView = Backbone.View.extend({

	className: 'user-list-invite-view',

	template: _.template(template),
	itemTemplate: _.template(userListInviteItemTemplate),

	events: {
		'keyup input': 'userTyping'
	},

	initialize: function(opts) {
		this.numInvites = 0;
		this.currentUser = opts.currentUser;
		this.currentUser.on('change', this.render, this);
	},

	render: function() {
		this.$el.html(this.template({
			currentUser: this.currentUser
		}));
		this.$users = this.$('ul.user-list');
		_(3).times(_.bind(this.addInviteField, this));
		return this;
	},

	addInviteField: function() {
		this.numInvites++;
		this.$users.append(this.itemTemplate({
			num: this.numInvites
		}));
	},

	userTyping: function() {
		var $lastField = this.$('li:last-child input'),
			lastVal = $lastField.val();

		if (lastVal !== '') {
			this.addInviteField();
		}
	}

});

export default = UserListInviteView;

