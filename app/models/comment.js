
/**
 * Module dependencies.
 * Questions for master list of questions
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , _ = require('underscore');


/**
 * Comment Schema
 */
var CommentSchema = new Schema({
  question: { type: Schema.Types.ObjectId, ref: 'Question'},
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  body: String,
  timeCreated: { type: Date, default: Date.now() }
});
mongoose.model('Comment', CommentSchema);








