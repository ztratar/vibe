// Module dependencies.
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('underscore');

// Feedback Schema
var FeedbackSchema = new Schema({
	time_created: { type: Date, default: Date.now() },
	status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending'},
	status_change_reason: { type: String },
	status_changed_by: { type: Schema.Types.ObjectId, ref: 'User' },
	time_status_changed: { type: Date },
	creator: { type: Schema.Types.ObjectId, ref: 'User' },
	company: { type: Schema.Types.ObjectId, ref: 'Company' },
	body: { type: String },
	votes: { type: Array, default: [] },
	num_votes: { type: Number, default: 0 }
});

// Validations
FeedbackSchema.path('body').validate(function(body) {
	return body && body.length;
}, 'Feedback can\'t be blank');

FeedbackSchema.path('body').validate(function(body) {
	return body.length <= 200;
}, 'That\'s too long');

// Methods
FeedbackSchema.methods = {

	stripInfo: function() {
		var feedback = this.toObject();

		feedback.votes = undefined;
		feedback.creator = undefined;
		feedback.status_changed_by = undefined;
		feedback.time_created = undefined;
		feedback.time_status_changed = undefined;
		feedback.company = undefined;

		return feedback;
	}

}

mongoose.model('Feedback', FeedbackSchema);

