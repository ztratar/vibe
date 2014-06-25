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
		current_user_voted: false,
		answer_data: [],
		chat: {
			chats_last_seen: {},
			num_chats: 0
		}
	},

	initialize: function() {
		var that = this;
		window.Vibe.faye.subscribe('/api/questions/' + this.get('_id') + '/new_answer', function(answerBody) {
			that.trigger('newAnswer', answerBody);
		});
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

		this.set('current_user_voted', true, { silent: true });

		window.Vibe.faye.publish('/api/questions/' + this.get('_id') + '/new_answer', answerBody);
	},

	leaveChat: function() {
		this.save({}, {
			url: this.url() + '/leave_chat'
		});
	}

});

export default = Question;
