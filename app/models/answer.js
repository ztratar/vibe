
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , _ = require('underscore');

/**
 * Answer Schema
 */

var AnswerSchema = new Schema({
  _creator: { type: Schema.Types.ObjectId, ref: 'User' },
  body: String,
  question: { type: Schema.Types.ObjectId, ref: 'Question' }
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



mongoose.model('Answer', AnswerSchema);
