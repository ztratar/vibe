var mongoose = require('mongoose'),
	Company = mongoose.model('Company'),
	helpers = require('../helpers');

/*
 * PUT /api/company
 *
 * Edit the user specified
 *
 * Query vars:
 *  	name: Name of the company
 *  	logo: Logo for the company, encoded in base_64
 *  	cover: Cover photo for the company, encoded in base_64
 */
exports.update = function(req, res, next) {
	if (!req.user) {
		return helpers.sendError(res, "You must be logged in");
	}

	if (!req.user.isAdmin) {
		return helpers.sendError(res, "Only admins can do this");
	}

	Company.findById(req.user.company._id, function(err, company) {
		if (err) return helpers.sendError(res, err);

		var body = req.body,
			changedLogo = false,
			changedCover = false;

		if (body.logo && body.logo.indexOf('data:image') !== -1) {
			company.logo = body.logo;
			changedLogo = true;
		}
		if (body.cover && body.cover.indexOf('data:image') !== -1) {
			company.cover = body.cover;
			changedCover = true;
		}
		if (body.name) company.name = body.name;

		company.save(function(err, company) {
			if (changedLogo) company.convertField('logo');
			if (changedCover) company.convertField('cover');
			res.send(company);
		});
	});
};


// Cache the app and passport
module.exports = function(exportedApp, exportedPassport) {
	if (exportedApp) app = exportedApp;
	if (exportedPassport) passport = exportedPassport;
	return exports;
};
