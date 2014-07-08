import 'backbone';
import User from 'models/user';

var Users = Backbone.Collection.extend({

	model: User,

	getNames: function(users, action) {
		var baseUserStr = '',
			users = this.toJSON();

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

		baseUserStr = _.escape(baseUserStr);

		return baseUserStr;
	},

	getNumPeopleString: function(num) {
		if (num === 1) {
			return '1 person';
		} else {
			return num + ' people';
		}
	}

});

export default = Users;
