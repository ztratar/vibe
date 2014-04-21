
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
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  body: String,
  anonymous: { type: Boolean, default: false },
  type: String,
  question: { type: Schema.Types.ObjectId, ref: 'Question' },
  survey: { type: Schema.Types.ObjectId, ref: 'Survey' }

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



mongoose.model('Answer', AnswerSchema);
