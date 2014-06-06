import BaseModel from 'models/baseModel';

var User = BaseModel.extend({

	urlRoot: '/api/users',

	defaults: {
		name: '',
		email: '',
		avatar: '/img/default_avatar.png'
	}

});

export default = User;
