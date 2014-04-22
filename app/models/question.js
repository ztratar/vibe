
/**
 * Module dependencies.
 * Questions for master list of questions
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , _ = require('underscore');


/**
 * MetaQuestion Schema
 */
var MetaQuestionSchema = new Schema({
  title: String,
  body: String,
  creator: { type: Schema.Types.ObjectId, ref: 'User' }
});

mongoose.model('MetaQuestion', MetaQuestionSchema);



/**
 * Question Schema
 */
var QuestionSchema = new Schema({
  metaQuestion: { type: Schema.Types.ObjectId, ref: 'MetaQuestion'},
  title: String,
  body: String,
  active: { type: Boolean, default: true },
  audience: { type: String, default: 'all' },
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  company:  { type: Schema.Types.ObjectId, ref: 'Company' }

});
mongoose.model('Question', QuestionSchema);








