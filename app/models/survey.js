
/**
 * Module dependencies.
 * Questions for master list of questions
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , _ = require('underscore');



var SurveySchema = new Schema({
  questions: [{type: Schema.Types.ObjectId, ref: 'Question' }],
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  company:  { type: Schema.Types.ObjectId, ref: 'Company' },
  recipient: { type: Schema.Types.ObjectId, ref: 'User' },
  dueDate: Date,
  timeCreated: { type: Date, default: Date.now() }

});
mongoose.model('Survey', SurveySchema);