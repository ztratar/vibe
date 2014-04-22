
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , _ = require('underscore');

/**
 * Company Schema
 */

var CompanySchema = new Schema({
  name: String,
  domain: String,
  size: { type: Number, default: 1 }
});

/**
 * Virtuals
 */



/**
 * Validations
 */



/**
 * Pre-save hook
 */



/**
 * Methods
 */



mongoose.model('Company', CompanySchema);
