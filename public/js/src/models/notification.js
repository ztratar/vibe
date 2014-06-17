import BaseModel from 'models/baseModel';

var Notification = BaseModel.extend({

	urlRoot: '/api/notifications',

	defaults: {
		time_created: new Date(),
		for_user: undefined,
		img: undefined,
		body: '',
		link: ''
	}

});

export default = Notification;

