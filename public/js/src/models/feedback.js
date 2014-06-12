import BaseModel from 'models/baseModel';

var Feedback = BaseModel.extend({

	urlRoot: '/api/feedback',

	defaults: {
		time_created: new Date(),
		status: '',
		body: '',
		num_votes: 0
	},

	approve: function() {
		this.save({
			status: 'approved'
		});
	},

	reject: function() {
		this.save({
			status: 'rejected'
		});
	}

});

export default = Feedback;
