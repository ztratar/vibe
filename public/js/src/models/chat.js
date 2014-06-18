import BaseModel from 'models/baseModel';

var Chat = BaseModel.extend({

	urlRoot: '/api/chats',

	defaults: {
		user: {},
		body: '',
		time_created: new Date(),
		num_likes: 0,
		current_user_liked: 0
	}

});

export default = Chat;
