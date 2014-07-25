// Module dependencies.
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	moment = require('moment'),
	_ = require('underscore');
	env = process.env.NODE_ENV || 'development',
	serverUrl = process.env === 'development' ? 'http://localhost:3000/' : 'https://getvibe.com/',
	helpers = require('../helpers'),
	config = require('../../config/config')[env];

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

	getCalculatedData: function(userExcludeId) {
		var users = this.data.users,
			firstUserId = this.data ? this.data.first_user_id : '',
			firstUser,
			peopleString = '',
			adhocSortedUsers,
			numPeopleString = (this.data && this.data.num_people) ? helpers.getNumPeopleString(this.data.num_people) : '',
			returnObj = {
				img: '',
				notifBody: '',
				link: '',
				timeAgo: ''
			};

		if (users && users.length) {
			users = _.filter(users, function(user) {
				return (user._id.toString() !== userExcludeId.toString());
			});
			users = _.compact(users);
			firstUser = _.find(users, function(user) {
				return user._id === firstUserId;
			}) || users[0];

			// Move first user to the 0th position
			adhocSortedUsers = _.without(users, firstUser);
			adhocSortedUsers = [firstUser].concat(adhocSortedUsers);

			if (adhocSortedUsers.length) {
				peopleString = helpers.getUsersListString(adhocSortedUsers);
			}
			returnObj.img = config.AWS.cloudfrontDomain + firstUser.avatar;
		}

		if (!returnObj.img) {
			returnObj.img = serverUrl + 'img/notifications/' + this.type + '.jpg';
		}

		if (this.type === 'question') {
			returnObj.notifBody = this.data.user + ' just asked a question: "' + this.data.question + '"';
			returnObj.img = config.AWS.cloudfrontDomain + this.img;
			returnObj.link = serverUrl + 'questions/' + this.data.questionId;
		} else if (this.type === 'question-vote') {
			returnObj.notifBody = numPeopleString + ' voted on "' + this.data.question + '"';
			returnObj.link = serverUrl + 'questions/' + this.data.questionId;
		} else if (this.type === 'feedback-archived') {
			returnObj.notifBody = 'Your suggestion was read and archived';
			if (this.data.reason && this.data.reason.length) {
				returnObj.notifBody += ' with the note "' + _.escape(this.data.reason) + '"';
			}
			returnObj.link = serverUrl;
		} else if (this.type === 'feedback-approved') {
			returnObj.notifBody = 'Congratulations, your feedback was just sent to everyone!';
			returnObj.link = serverUrl;
		} else if (this.type === 'feedback-agree') {
			returnObj.notifBody = numPeopleString + ' agreed with the suggestion "' + this.data.feedback + '"';
			returnObj.link = serverUrl + 'feedback/' + this.data.feedbackId;
		} else if (this.type === 'question-chat') {
			returnObj.notifBody = peopleString + ' chatting on "' + this.data.question + '"';
			returnObj.link = serverUrl + 'questions/' + this.data.questionId;
		} else if (this.type === 'feedback-chat') {
			returnObj.notifBody = peopleString + ' chatting on "' + this.data.feedback + '"';
			returnObj.link = serverUrl + 'feedback/' + this.data.feedbackId;
		}

		if (returnObj.notifBody.length > 80) {
			returnObj.notifBody = returnObj.notifBody.slice(0,77) + '...';
		}

		returnObj.timeAgo = moment(this.time_updated).fromNow();

		return returnObj;
	},

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
