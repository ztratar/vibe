
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
  body: String,
  creator: { type: Schema.Types.ObjectId, ref: 'User' }
});

mongoose.model('MetaQuestion', MetaQuestionSchema);



/**
 * Question Schema
 */
var QuestionSchema = new Schema({
  metaQuestion: { type: Schema.Types.ObjectId, ref: 'MetaQuestion'},
  body: String,
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  company:  { type: Schema.Types.ObjectId, ref: 'Company' }
});
mongoose.model('Question', QuestionSchema);



/**
 * Survey Schema
 */
var SurveySchema = new Schema({
  name: String,
  questions: [{type: Schema.Types.ObjectId, ref: 'Question' }],
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  company:  { type: Schema.Types.ObjectId, ref: 'Company' }
});
mongoose.model('Survey', SurveySchema);




