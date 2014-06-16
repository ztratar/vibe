// Module dependencies.
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	Async = require('async'),
	Answer = mongoose.model('Answer'),
	QuestionInstance = mongoose.model('QuestionInstance'),
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
	timeCreated: { type: Date, default: Date.now() },
	time_last_sent: { type: Date }
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

	withAnswerData: function(currentUser, cb) {
		var question = this.toObject();

		QuestionInstance
			.find({
				question: this._id
			})
			.sort({ _id: 1 })
			.exec(function(err, questionInstances) {
				var lastInstance = _.last(questionInstances);

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

				question.current_user_voted = lastInstance.didUserAnswer(currentUser._id);

				cb(question);
			});
	}

};

mongoose.model('Question', QuestionSchema);
