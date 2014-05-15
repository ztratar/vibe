
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , _ = require('underscore');

/**
 * AccessRequest Schema
 */

var AccessRequestSchema = new Schema({
  company_name: { type: String, trim: true, default: '' },
  email: { type: String, lowercase: true, trim: true, index: true }
});

AccessRequestSchema.path('email').validate(function (email) {
  return email && email.length
}, 'Email cannot be blank');

AccessRequestSchema.path('email').validate(function (email) {
  var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailRegex.test(email.text);
}, 'That email doesnt work');


mongoose.model('AccessRequest', AccessRequestSchema);
