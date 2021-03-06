// Module dependencies.
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	Async = require('async'),
	Answer = mongoose.model('Answer'),
	QuestionInstance = mongoose.model('QuestionInstance'),
	QuestionInstanceSchema = require('./questionInstance'),
	ChatRoomPlugin = require('./plugins/chatRoomPlugin'),
	_ = require('underscore');

// Question Schema
var QuestionSchema = new Schema({
	meta_question: { type: Schema.Types.ObjectId, ref: 'MetaQuestion' },
	body: String,
	active: { type: Boolean, default: true },
	send_on_days: { type: Array, default: [0,0,0,0,0] },
	audience: { type: String, default: 'all' },
	creator: { type: Schema.Types.ObjectId, ref: 'User' },
	company: { type: Schema.Types.ObjectId, ref: 'Company' },
	time_created: { type: Date, default: Date.now },
	time_last_sent: { type: Date },
	user_last_sent: {
		id: { type: Schema.Types.ObjectId, ref: 'User' },
		name: { type: String },
		avatar: { type: String }
	},
	question_instance: [QuestionInstanceSchema]
});

// Validations
QuestionSchema.path('send_on_days').validate(function (daysArray) {
	var allNum = true;

	for (var i = 0; i < daysArray; i++) {
		if (typeof daysArray[i] !== 'number'
				|| daysArray[i] > 2) {
			allNum = false;
		}
	}

	return allNum && daysArray.length === 5;
}, 'Days array must hold values 0-2 for each and be of length 5');

// Question Methods
QuestionSchema.methods = {

	addUser: function(user) {
		QuestionInstance
			.findOne({
				question: this._id
			})
			.sort({ _id: -1 })
			.exec(function(err, questionInstance) {
				if (questionInstance) {
					questionInstance.addUser(user);
				}
			});
	},

	withAnswerData: function(currentUser, cb) {
		var question = this.toObject();

		QuestionInstance
			.find({
				question: this._id
			})
			.sort({ _id: 1 })
			.exec(function(err, questionInstances) {
				var lastInstance = _.last(questionInstances);

				if (question.audience === 'all'
						|| (question.audience === 'admins' && currentUser.isAdmin)) {
					question.answer_data = _.map(questionInstances, function(instance) {
						var avg = instance.getAvg();
						if (avg !== false || instance === lastInstance) {
							return {
								time_sent: instance.time_sent,
								avg: avg,
								num_sent_to: instance.num_sent_to,
								num_completed: instance.num_completed,
								answers: instance.answers
							};
						} else {
							return undefined;
						}
					});
					question.answer_data = _.reject(question.answer_data, function(data) {
						return data === undefined;
					});
				} else {
					question.answer_data = 'admins';
				}

				if (currentUser) {
					question.current_user_voted = lastInstance.didUserAnswer(currentUser._id);
				} else {
					question.current_user_voted = false;
				}

				cb(question);
			});
	}

};

// Attach the chat room!
QuestionSchema.plugin(ChatRoomPlugin);

mongoose.model('Question', QuestionSchema);
