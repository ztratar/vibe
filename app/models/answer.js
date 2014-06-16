// Module dependencies.
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('underscore');

// Answer Schema
var AnswerSchema = new Schema({
	creator: { type: Schema.Types.ObjectId, ref: 'User' },
	question: { type: Schema.Types.ObjectId, ref: 'Question' },
	question_instance: { type: Schema.Types.ObjectId, ref: 'QuestionInstance' },
	body: Schema.Types.Mixed,
	time_created: { type: Date, default: Date.now() }
});

AnswerSchema.path('body').validate(function(body) {
	return (body !== null && body !== undefined);
}, 'An answer is required');

mongoose.model('Answer', AnswerSchema);
