
/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('underscore'),
	helpers = require('../helpers');

/**
 * Company Schema
 */

var CompanySchema = new Schema({
	name: String,
	domain: String,
	size: { type: Number, default: 1 },
	logo: String,
	cover: String,
	logo_v: { type: Number, default: 0 },
	cover_v: { type: Number, default: 0 },
	time_created: { type: Date, default: Date.now }
});

/**
 * Virtuals
 */



/**
 * Validations
 */
CompanySchema.path('name').validate(function (name) {
	return name && name.length;
}, 'Company name cannot be blank');

CompanySchema.path('domain').validate(function (website) {
	return website && website.length;
}, 'Company website cannot be blank');

CompanySchema.path('domain').validate(function (website) {
	return /^(?:[a-zA-Z0-9]+(?:\-*[a-zA-Z0-9])*\.)+[a-zA-Z]{2,6}$/.test(website);
}, 'Please format the website like yourdomain.com');

/**
 * Pre-save hook
 */



/**
 * Methods
 */

CompanySchema.methods = {

	hasConvertedField: function(fieldName) {
		return this[fieldName].indexOf('data:image') === -1;
	},

	convertField: function(fieldName, cb) {
		var company = this,
			imgBuffer,
			imgType,
			imgKey = 'company-' + fieldName + '-' + company._id + '-v' + company[fieldName + '_v'];

		if (company.hasConvertedField(fieldName)) {
			return;
		}

		if (company[fieldName].indexOf('image/png') !== -1) {
			imgType = 'image/png';
		} else {
			imgType = 'image/jpeg';
		}

		imgBuffer = new Buffer(company[fieldName].replace(/^data:image\/\w+;base64,/, ""),'base64');

		helpers.setHostedFile({
			'Key': imgKey,
			'Body': imgBuffer,
			'ContentLength': imgBuffer.length,
			'ContentType': imgType,
			'ACL': 'public-read'
		}, function(err, url) {
			if (err) return;
			company[fieldName] = imgKey;
			company[fieldName + '_v']++;
			company.save(function(err, company) {
				if (typeof cb === 'function') {
					if (err) return cb(err);
					cb(null, company);
				}
			});
		});
	},

};

mongoose.model('Company', CompanySchema);
