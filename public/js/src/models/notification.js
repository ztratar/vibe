import BaseModel from 'models/baseModel';

var Notification = BaseModel.extend({

	urlRoot: '/api/notifications',

	defaults: {
		time_created: new Date(),
		time_updated: new Date(),
		data: {},
		read: false,
		type: '',
		img: ''
	}

});

export default = Notification;

