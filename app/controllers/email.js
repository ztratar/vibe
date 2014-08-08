// Module dependencies.
var _ = require('underscore'),
	moment = require('moment'),
	mongoose = require('mongoose'),
	env = process.env.NODE_ENV || 'development',
	User = mongoose.model('User'),
	Notification = mongoose.model('Notification'),
	config = require('../../config/config')[env],
	sendgrid = require('sendgrid')('getvibe', 'ivREB7QmZuusFMX7'),
	app;

function addNotificationTemplateVars(currentUser, notifications) {
	for (var i = 0; i < notifications.length; i++) {
		var tempNotification = notifications[i].toObject();
		_.extend(tempNotification, notifications[i].getCalculatedData(currentUser._id, true));
		notifications[i] = tempNotification;
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
 * Worker task to send all notification emails. Uses the scheduler addon.
 */
exports.all_users_send_unread_notifications = function(cb) {
	console.log('Sending unread emails...');

	User.find({
		active: true,
		'emails.receive_unread_notifs': true
	}, function(err, users) {
		if (err || !users || !users.length) return;

		_.each(users, function(user) {
			exports.send_unread_notifications(user);
		});
	});
};

/*
 * INTERNAL
 *
 * Send an unread notifications email to the user
 */
exports.send_unread_notifications = function(user) {
	Notification
	.find({
		for_user: user._id,
		read: false
	})
	.sort({ time_updated: -1 })
	.limit(20)
	.exec(function(err, notifications) {
		if (err) return;
		if (!notifications.length) return;

		notifications = addNotificationTemplateVars(user, notifications);

		console.log('Sending unread notification email for user', user.email);

		exports.send({
			to: user.email,
			from: 'info@getvibe.com',
			subject: '(' + notifications.length + ') - ' + notifications[0].notifBody.replace('<strong>','').replace('</strong>',''),
			templateName: 'unread_notifications',
			templateData: {
				notifications: notifications,
				unescape: function(model, attr) {
					return model[attr];
				}
			}
		});
	});
};

// Cache app object upon first call
module.exports = function(exportedApp) {
	if (exportedApp) app = exportedApp;
	return exports;
};
