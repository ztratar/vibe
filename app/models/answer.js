
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
  body: Schema.Types.Mixed,
  anonymous: { type: Boolean, default: false },
  type: { type: String, enum: ['text', 'scale'] },
  question: { type: Schema.Types.ObjectId, ref: 'Question' },
  survey: { type: Schema.Types.ObjectId, ref: 'Survey' },
  timeCreated: { type: Date, default: Date.now() }
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
