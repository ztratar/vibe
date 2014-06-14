// Module dependencies.
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('underscore');

var QuestionInstanceSchema = new Schema({
	question: {
		type: Schema.Types.ObjectId,
		ref: 'Question',
		required: true
	},
	time_sent: { type: Date, default: Date.now() },
	time_updated: { type: Date, default: Date.now() },
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
			sum += this.answers;
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
	}

};

mongoose.model('QuestionInstance', QuestionInstanceSchema);
