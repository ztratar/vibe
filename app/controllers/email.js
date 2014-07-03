// Module dependencies.
var _ = require('underscore'),
	moment = require('moment'),
	mongoose = require('mongoose'),
	env = process.env.NODE_ENV || 'development',
	Notification = mongoose.model('Notification'),
	config = require('../../config/config')[env],
	sendgrid = require('sendgrid')('getvibe', 'ivREB7QmZuusFMX7'),
	helpers = require('../helpers'),
	app,
	serverUrl = process.env === 'development' ? 'http://localhost:3000/' : 'https://getvibe.com/';

function addNotificationTemplateVars(currentUser, notifications) {
	for (var i = 0; i < notifications.length; i++) {
		notifications[i] = notifications[i].toObject();

		if (notifications[i].data && notifications[i].data.num_people) {
			notifications[i].numPeopleString = helpers.getNumPeopleString(notifications[i].data.num_people);
		}

		var users = notifications.data ? notifications[i].data.users : [],
			firstUserId = notifications[i].data ? notifications[i].data.first_user_id : '',
			firstUser,
			adhocSortedUsers;

		if (users && users.length) {
			users = _.filter(users, function(user) {
				return (user._id.toString() !== currentUser._id.toString());
			});
			users = _.compact(users);
			firstUser = _.find(users, function(user) {
				return user._id === firstUserId;
			}) || users[0];

			// Move first user to the 0th position
			adhocSortedUsers = _.without(users, firstUser);
			adhocSortedUsers = [firstUser].concat(adhocSortedUsers);

			if (adhocSortedUsers.length) {
				notifications[i].peopleString = helpers.getUsersListString(adhocSortedUsers);
			} else {
				notifications[i].peopleString = '';
			}
			notifications[i].img = firstUser.avatar;
		}

		if (!notifications[i].img) {
			notifications[i].img = serverUrl + 'img/notifications/' + notifications[i].type + '.jpg';
		}

		if (notifications[i].type === 'question') {
			notifications[i].notifBody = notifications[i].data.user + ' just asked a question: "' + notifications[i].data.question + '"';
			notifications[i].link = serverUrl + 'questions/' + notifications[i].data.questionId;
		} else if (notifications[i].type === 'question-vote') {
			notifications[i].notifBody = notifications[i].numPeopleString + ' voted on "' + notifications[i].data.question + '"';
			notifications[i].link = serverUrl + 'questions/' + notifications[i].data.questionId;
		} else if (notifications[i].type === 'feedback-rejected') {
			notifications[i].notifBody = 'Sorry, your suggestion wasn\'t selected to send to everyone because "' + notifications[i].data.reason + '"';
			notifications[i].link = serverUrl;
		} else if (notifications[i].type === 'feedback-approved') {
			notifications[i].notifBody = 'Congratulations, your feedback was just sent to everyone!';
			notifications[i].link = serverUrl;
		} else if (notifications[i].type === 'feedback-agree') {
			notifications[i].notifBody = notifications[i].numPeopleString + ' agreed with the suggestion "' + notifications[i].data.feedback + '"';
			notifications[i].link = serverUrl + 'feedback/' + notifications[i].data.feedbackId;
		} else if (notifications[i].type === 'question-chat') {
			notifications[i].notifBody = notifications[i].peopleString + ' chatting on "' + notifications[i].data.question + '"';
			notifications[i].link = serverUrl + 'questions/' + notifications[i].data.questionId;
		} else if (notifications[i].type === 'feedback-chat') {
			notifications[i].notifBody = notifications[i].peopleString + ' chatting on "' + notifications[i].data.feedback + '"';
			notifications[i].link = serverUrl + 'feedback/' + notifications[i].data.feedbackId;
		}

		if (notifications[i].notifBody.length > 80) {
			notifications[i].notifBody = notifications[i].notifBody.slice(0,77) + '...';
		}

		notifications[i].timeAgo = moment(notifications.time_updated).fromNow();
	}

	return notifications;
};

/*
 * INTERNAL email.send
 *
 * Send an email. Simple as that!
 *
 * Options:
 * 		to: where will the email be sent
 * 		from: what address should the from field say
 * 		subject: subject line of the mail
 * 		templateName: must correlate with views/emails/<template_name>
 * 		templateData: data passed into the template
 */
exports.send = function(options) {
	options = _.extend({
		to: '',
		from: 'info@getvibe.com',
		subject: '',
		templateName: '',
		templateData: {},
	}, options);

	_.extend(options.templateData, {
		subject: options.subject,
		static_path: config.static_path
	});

	app.render(
		'emails/'+options.templateName,
		options.templateData,
		function(err, html) {
			if (err) {
				console.log('mail render err', err);
				return;
			}
			sendgrid.send({
				to: options.to,
				from: options.from,
				subject: options.subject,
				html: html
			}, function(err, json) {
				if (err) console.log(err);
			});
		}
	);
};

/*
 * INTERNAL
 *
 * Send an unread notifications email to the user
 */
exports.send_unread_notifications = function(user) {
	Notification.find({
		for_user: user._id,
		read: false
	}, function(err, notifications) {
		if (err) return;
		if (!notifications.length) return;

		notifications = addNotificationTemplateVars(user, notifications);

		exports.send({
			to: user.email,
			from: 'info@getvibe.com',
			subject: '(' + notifications.length + ') - ' + notifications[0].notifBody,
			templateName: 'unread_notifications',
			templateData: {
				notifications: notifications
			}
		});
	});
};

// Cache app object upon first call
module.exports = function(exportedApp) {
	if (exportedApp) app = exportedApp;
	return exports;
};
