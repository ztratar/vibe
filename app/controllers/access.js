
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
	, env = process.env.NODE_ENV || 'development'
	, config = require('../../config/config')[env]
	, Async = require('async')
	, AccessRequest = mongoose.model('AccessRequest')
	, sendgrid = require('sendgrid')('getvibe', 'ivREB7QmZuusFMX7')
	, app;

/**
* POST /access/request
* User requests beta access
* query strings:
*	 company_name
*	 email
*/
exports.request = function(req, res, next){
	var findQuery = AccessRequest.find({
		email: req.body.email
	});

	findQuery.exec(function(err, accessRequest){
		if (err) return next(err)

		if (accessRequest.length) {
			return res.send({
				error: 'You\'ve already requested an invite',
				request: accessRequest[0]
			});
		} else {
			accessRequest = new AccessRequest({
				email: req.body.email,
				company_name: req.body.company_name
			});
			accessRequest.save(function(err, model) {
				if (err) {
					if (err.errors.email) {
						return res.send({
							error: err.errors.email.message
						});
					}
				}

				var emailSubject = 'We\'ve received your beta request!';

				app.render('emails/access_requested', {
					subject: emailSubject,
					static_path: config.static_path
				}, function(err, html) {
					sendgrid.send({
						to: req.body.email,
						from: 'info@getvibe.org',
						subject: emailSubject,
						html: html
					}, function(err, json) {
						console.log(json);
						if (err) console.log(err);
					});
				});

				return res.send({
					status: 'success',
					request: model
				});
			});
		}
	});
};

module.exports = function(exportedApp) {
	app = exportedApp;

	return exports;
};

