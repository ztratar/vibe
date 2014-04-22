
/**
 * Module dependencies.
 * Questions for master list of questions
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Async = require('async')
  , Answer = mongoose.model('Answer')
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
  company:  { type: Schema.Types.ObjectId, ref: 'Company' },
  timeCreated: { type: Date, default: Date.now() }
});

QuestionSchema.methods = {
  calculateData: function(cb){

    Answer.find({
        question: this._id,
        type: 'scale'
      })
      .sort(timeDue)
      .exec(function(err, answers){
        if(err) return cb(err);
        if(!answers.length) return cb(null, []);

        var data = [];
        var i;
        var total = 0;
        var count = 0;
        var currDate = answers[0].timeDue;
        for(i = 0; i < answers.length; i++){
          if(answers[i].timeDue === currDate){
            total += answers[i].body;
            count += 1;
          } else {
            data.push(total/count);
            total = 0;
            count = 0;
            currDate = answers[i].timeDue;
          }
        }

        return cb(null, data);

      });
  }

};

mongoose.model('Question', QuestionSchema);








