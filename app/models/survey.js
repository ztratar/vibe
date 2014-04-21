/**
 * Module dependencies.
 * Questions for master list of questions
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , _ = require('underscore');



var SurveySchema = new Schema({
  dueDate: Date,
  recipient: { type: Schema.Types.ObjectId, ref: 'User' },
  questions: [{type: Schema.Types.ObjectId, ref: 'Question' }],
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  company:  { type: Schema.Types.ObjectId, ref: 'Company' }
});
mongoose.model('Survey', SurveySchema);