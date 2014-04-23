import BaseModel from 'models/baseModel';
import User from 'models/user';

var ChatMessage = BaseModel.extend({

	defaults: {
		user: {},
		text: '',
		timeCreated: new Date()
	},

	initialize: function() {
		this.on('change:user', this.userToModel);
		this.userToModel();
	},

	userToModel: function() {
		var userData = this.get('user'),
			tempUser;

		if (userData) {
			if (!(userData instanceof User)) {
				tempUser = new User(userData);
				this.set('user', tempUser, {
					silent: true	
				});
			}
		}
	}

});

export default = ChatMessage;
