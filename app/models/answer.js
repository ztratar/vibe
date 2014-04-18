
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
  _id: Number,
  _creator: { type: Schema.Types.ObjectId, ref: 'User' },
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



mongoose.model('Answer', AnswerSchema);
