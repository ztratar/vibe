// Module dependencies.
var mongoose = require('mongoose'),
	_ = require('underscore'),
	User = mongoose.model('User'),
	AccessRequest = mongoose.model('AccessRequest'),
	email = require('./email')(),
	helpers = require('../helpers'),
	app;

/*
 * POST /api/access/request
 *
 * User requests beta access
 *
 * query vars:
 * 		company_name (String)
 *	 	email (String)
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

				email.send({
					to: req.body.email,
					subject: 'We\'ve received your beta request!',
					templateName: 'access_requested'
				});

				return res.send(200, {
					status: 'success',
					request: model
				});
			});
		}
	});
};

/*
 * POST /api/access/invite
 *
 * This sends an admin-level invite email
 * to the address specified for them to
 * begin the company registration process.
 * Please use wisely -- this will onboard
 * a new company.
 *
 * Query vars:
 * 		email (String)
 */
exports.invite = function(req, res) {
	// Check if valid email
	if (!helpers.isValidEmail(req.body.email)) {
		return res.send({
			error: 'That email doesn\'t work'
		});
	}

	if (!req.body.company_name || !req.body.company_name.length) {
		return res.send({
			error: 'Company name must be filled out'
		});
	}

	User.findOne({
		email: req.body.email
	}, function(err, user) {
		// Check if user exists
		if (user) {
			return res.send({
				error: 'That user already exists',
				data: user
			});
		}

		// Load existing access request object if exists
		AccessRequest.findOne({
			email: req.body.email
		}, function(err, accessRequest) {
			// Update access request object to show that
			// invite has been fulfilled
			if (accessRequest) {
				if (accessRequest.invited) {
					return res.send({
						error: 'Already invited'
					});
				}

				accessRequest.invited = true;
			} else {
				accessRequest = new AccessRequest({
					email: req.body.email,
					company_name: req.body.company_name,
					invited: true
				});
			}

			accessRequest.save(function(err, accessRequest) {
				// Send them the invite
				email.send({
					to: req.body.email,
					subject: 'You\'ve been invited to Vibe!',
					templateName: 'invite_company',
					templateData: {
						access_id: accessRequest._id.toString(),
						email: accessRequest.email,
						company_name: accessRequest.company_name
					}
				});

				res.send({ message: 'success' });
			});
		});
	});
};

// Cache app object upon first call
module.exports = function(exportedApp) {
	if (exportedApp) app = exportedApp;
	return exports;
};
