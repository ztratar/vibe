// Module dependencies.
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('underscore');

// Notification Schema
var NotificationSchema = new Schema({
	for_user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		index: true
	},
	read: { type: Boolean, default: false },
	type: { type: String, required: true },
	img: { type: String, default: '' },
	data: { type: Schema.Types.Mixed },
	time_created: { type: Date, default: Date.now },
	time_updated: {
		type: Date,
		default: Date.now,
		index: true
	},
	cluster_tag: {
		type: String,
		index: true
	}
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
		} else if (this.type === 'feedback-archived') {
			return true;
		} else if (this.type === 'feedback-approved') {
			return true;
		} else if (this.type === 'feedback-agree') {
			return (bd.num_people > 0
					&& bd.feedback
					&& bd.feedback.length
					&& bd.feedbackId);
		} else if (this.type === 'feedback-chat') {
			return (bd.users && bd.users.length
					&& bd.feedbackId
					&& bd.feedback && bd.feedback.length);
		} else if (this.type === 'question-chat') {
			return (bd.users && bd.users.length
					&& bd.questionId
					&& bd.question && bd.question.length);
		}

		return false;
	}

};

mongoose.model('Notification', NotificationSchema);
