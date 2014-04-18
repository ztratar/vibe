
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
  body: String,
  answers: [{ type: Number, ref: 'Answer'}],
  _creator: { type: Schema.Types.ObjectId, ref: 'User' }
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
