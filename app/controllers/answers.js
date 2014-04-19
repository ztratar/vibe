
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , MetaQuestion = mongoose.model('MetaQuestion')
  , Question = mongoose.model('Question')
  , Answer = mongoose.model('Answer');



/**
* GET /api/answers/:id
* retrieve an answer
*/
exports.get = function (req, res, next) {
  Answer.findById(req.params['id'], function (err, answer){
    if (err || !answer) return next(new Error("can't find answer"));

    return res.send(answer);
  });
};


/**
* POST /api/answers/:questionId
* Create a new answer
params:
{
  answer: answer content
}
*/
exports.create = function (req, res, next) {
  if(!req.body.answer) return next(new Error("no answer specified"));

  Question.findById(req.params['questionId'], function(err, question){
    if (err || !question) return next(new Error("can't find question"));

    Answer.create({
      body: req.body.answer,
      creator: req.user._id,
      question: question._id
    }, function(err, answer){
      if(err || !answer) return next(new Error("can't create answer"));

      return res.send(answer);
    });
  });

};


/**
* DELETE /api/answers/:id
* retrieve an answer
*/
exports.delete = function (req, res, next) {
  Answer.findById(req.params['id'], function (err, answer){
    if (err || !answer) return next(new Error("can't find answer"));

    answer.remove(function(err, answer){
      if(err) return next(err);

      return res.send(answer);
    });
  });

};