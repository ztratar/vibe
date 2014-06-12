// Module dependencies.
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('underscore');

// Post Schema
var PostSchema = new Schema({
	time_created: { type: Date, default: Date.now() },
	company: { type: Schema.Types.ObjectId, ref: 'Company' },
	for_user: { type: Schema.Types.ObjectId, ref: 'User' },
	content_type: { type: String, enum: ['feedback', 'question'] },
	feedback: { type: Schema.Types.ObjectId, ref: 'Feedback', default: null },
	question: { type: Schema.Types.ObjectId, ref: 'Question', default: null }
});

// Validations
PostSchema.path('for_user').validate(function(userId) {
	return userId && userId.length;
}, 'User ID must be specified');

PostSchema.path('content_type').validate(function(contentType) {
	return contentType && contentType.length;
}, 'Content type is required');

mongoose.model('Post', PostSchema);

