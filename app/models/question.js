
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
      .sort('timeDue')
      .lean()
      .exec(function(err, answers){
        if(err) return cb(err);
        if(!answers.length){
          return cb(null, []);
        }

        var data = [];
        var i;
        var total = 0;
        var count = 0;
        var currDate = Math.floor(new Date(answers[0].timeDue).getTime()/1000);

        // All this is pretty slow... low hanging optimization fruit
        for(i = 0; i < answers.length; i++){
          if(typeof(answers[i].body) !== "number"){
            answers[i].body = parseInt(answers[i].body, 10);
          }


          if(Math.floor(answers[i].timeDue.getTime()/1000) === currDate){
            total += answers[i].body;
            count += 1;
          } else {

            data.push(total/count);

            total = 0;
            count = 0;
            currDate = Math.floor(new Date(answers[i].timeDue).getTime()/1000);
          }
        }

        data.push(total/count);
        return cb(null, data);
      });
  },

  getAnswers: function(cb){
    var _this = this;

    Answer.find({question: _this._id})
    .lean()
    .exec(function(err, answers){
      if(err) return cb(err);

      return cb(null, answers)
    });
  }


};

mongoose.model('Question', QuestionSchema);








