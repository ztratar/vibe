// Module dependencies.
var mongoose = require('mongoose'),
	Async = require('async'),
	AccessRequest = mongoose.model('AccessRequest'),
	email = require('./email'),
	app;

/*
 * POST /access/request
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

// Cache app object upon first call
module.exports = function(exportedApp) {
	if (exportedApp) app = exportedApp;
	return exports;
};
