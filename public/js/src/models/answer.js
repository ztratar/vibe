import BaseModel from 'models/baseModel';

var Answer = BaseModel.extend({

	urlRoot: function() {
		return '/api/questions/' + this.get('question') + '/answers';
	},

	defaults: {
		body: undefined,
		time_created: new Date(),
		question: undefined,
		question_instance: undefined
	}

});

export default = Answer;
