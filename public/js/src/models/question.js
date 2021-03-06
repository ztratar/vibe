import BaseModel from 'models/baseModel';
import Answer from 'models/answer';

var Question = BaseModel.extend({

	urlRoot: window.Vibe.serverUrl + 'api/questions',

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
		if (window.Vibe.faye) {
			window.Vibe.faye.subscribe('/api/questions/' + this.get('_id') + '/new_answer', function(answerBody) {
				that.trigger('newAnswer', answerBody);
			});
		}
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

		if (window.Vibe.faye) {
			window.Vibe.faye.publish('/api/questions/' + this.get('_id') + '/new_answer', answerBody);
		}
	},

	leaveChat: function() {
		this.save({}, {
			url: this.url() + '/leave_chat'
		});
	},

	getLatestCompletionPercentage: function(offset) {
		offset = offset || 0;

		var lastData = _.last(this.get('answer_data'));

		return (lastData.num_completed + offset) / lastData.num_sent_to;
	},

	removePosts: function(reasonVal) {
		$.ajax({
			type: 'PUT',
			url: this.url() + '/remove_posts'
		});
	},

	makePrivateToAdmins: function(cb) {
		this.save({
			audience: 'admins'
		},{
			success: function() {
				cb && cb();
			}
		});
	},

	makePublic: function(cb) {
		this.save({
			audience: 'all'
		},{
			success: function() {
				cb && cb();
			}
		});
	}

});

export default = Question;
