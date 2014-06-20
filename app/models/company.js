
/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('underscore');

/**
 * Company Schema
 */

var CompanySchema = new Schema({
	name: String,
	domain: String,
	size: { type: Number, default: 1 },
	logo: String,
	cover: String,
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

};

mongoose.model('Company', CompanySchema);
