
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , _ = require('underscore')
  , helpers = require('../helpers');

/**
 * AccessRequest Schema
 */

var AccessRequestSchema = new Schema({
  company_name: { type: String, trim: true, default: '' },
  email: { type: String, lowercase: true, trim: true, index: true },
  invited: { type: Boolean, default: false },
  registered: { type: Boolean, default: false }
});

AccessRequestSchema.path('email').validate(function (email) {
  return email && email.length;
}, 'Email cannot be blank');

AccessRequestSchema.path('email').validate(function (email) {
  return helpers.isValidEmail(email);
}, 'That email doesnt work');

mongoose.model('AccessRequest', AccessRequestSchema);
