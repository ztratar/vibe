// Module dependencies.
var _ = require('underscore'),
	env = process.env.NODE_ENV || 'development',
	config = require('../../config/config')[env],
	sendgrid = require('sendgrid')('getvibe', 'ivREB7QmZuusFMX7'),
	app;

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
		from: 'info@getvibe.org',
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
				console.log(err);
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

// Cache app object upon first call
module.exports = function(exportedApp) {
	if (exportedApp) app = exportedApp;
	return exports;
};
