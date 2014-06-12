import BaseModel from 'models/baseModel';

var Feedback = BaseModel.extend({

	urlRoot: '/api/feedback',

	defaults: {
		time_created: new Date(),
		approved: undefined,
		body: '',
		num_votes: 0
	}

});

export default = Feedback;
