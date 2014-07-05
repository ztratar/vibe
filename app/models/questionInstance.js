// Module dependencies.
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	Answer = mongoose.model('Answer'),
	_ = require('underscore');

var QuestionInstanceSchema = new Schema({
	question: {
		type: Schema.Types.ObjectId,
		ref: 'Question',
		required: true,
		index: true
	},
	time_sent: { type: Date, default: Date.now },
	time_updated: { type: Date, default: Date.now },
	users_sent_to: { type: Array, default: [] },
	users_voted: { type: Array, default: [] },
	num_sent_to: { type: Number, default: 1 },
	num_completed: { type: Number, default: 0 },
	answers: { type: Array, default: [] }
});

// QuestionInstance Methods
QuestionInstanceSchema.methods = {

	getAvg: function() {
		var sum = 0,
			i = 0;

		if (!this.answers.length) return false;

		for (i = 0; i < this.answers.length; i++) {
			sum += parseInt(this.answers[i], 10);
		}

		return sum / this.answers.length;
	},

	getPercentageCompleted: function() {
		return this.num_completed / this.num_sent_to;
	},

	didUserAnswer: function(userId) {
		return _.contains(_.map(this.users_voted, function(vote) {
			return vote.toString();
		}), userId.toString());
	},

	answer: function(user, answerBody, cb) {
		var qI = this;

		this.update({
			$inc: {
				num_completed: 1
			},
			$push: {
				users_voted: user._id,
				answers: answerBody
			}
		}, function(err, numAffected) {
			if (err) return cb(err);

			Answer.create({
				creator: user._id,
				question: qI.question,
				question_instance: qI._id,
				body: answerBody
			}, function(err, answer) {
				if (err) return cb(err);
				cb(null, answer);
			});
		});
	}
};

mongoose.model('QuestionInstance', QuestionInstanceSchema);

exports = module.exports = QuestionInstanceSchema;
