
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , _ = require('underscore');

/**
 * Question Schema
 */

var QuestionSchema = new Schema({
  body: String
})

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



mongoose.model('Question', QuestionSchema);
