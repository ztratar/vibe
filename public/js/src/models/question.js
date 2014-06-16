import BaseModel from 'models/baseModel';
import Answer from 'models/answer';

var Question = BaseModel.extend({

	urlRoot: '/api/questions',

	defaults: {
		_id: undefined,
		meta_question: undefined,
		body: '',
		active: true,
		send_on_days: [0, 0, 0, 0, 0],
		from: {
			name: 'anonymous'
		},
		to: {
			name: 'everyone'
		},
		answer_data: []
	},

	deselect: function() {
		this.set('active', false);
		return this.save();
	},

	answer: function(answerBody) {
		var newAnswer = new Answer({
			body: answerBody,
			question: this.get('_id')
		});

		newAnswer.save();

		this.trigger('newAnswer', answerBody);
	}

});

export default = Question;
