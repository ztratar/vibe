// Module dependencies.
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('underscore');

// Notification Schema
var NotificationSchema = new Schema({
	for_user: { type: Schema.Types.ObjectId, ref: 'User' },
	read: { type: Boolean, default: false },
	type: { type: String, required: true },
	img: { type: String, default: '' },
	data: { type: Schema.Types.Mixed },
	time_created: { type: Date, default: Date.now },
	time_updated: { type: Date, default: Date.now },
	cluster_tag: { type: String },
	cluster_data: Schema.Types.Mixed
});

// Validations
NotificationSchema.path('for_user').validate(function(userId) {
	return userId && userId.length;
}, 'User ID must be specified');


NotificationSchema.methods = {

	verifyData: function() {
		var bd = this.data;

		if (this.type === 'question') {
			if (bd.user && bd.user.length
					&& bd.question && bd.question.length
					&& bd.questionId) {
				return true;
			}
		} else if (this.type === 'question-vote') {
			if (bd.num_people > 0
					&& bd.question && bd.question.length
					&& bd.questionId) {
				return true;
			}
		} else if (this.type === 'feedback-rejected') {
			if (bd.reason && bd.reason.length) {
				return true;
			}
		} else if (this.type === 'feedback-approved') {
			return true;
		} else if (this.type === 'feedback-agree') {
			return (bd.num_people > 0
					&& bd.feedback
					&& bd.feedback.length
					&& bd.feedbackId);
		}

		return false;
	}

};

mongoose.model('Notification', NotificationSchema);
