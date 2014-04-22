
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , MetaQuestion = mongoose.model('MetaQuestion')
  , Question = mongoose.model('Question')
  , Answer = mongoose.model('Answer');


/**
* GET /answers
* get all users' answers
* query strings:
*
*/
exports.index = function(req, res, next){

  var query = Answer.find({creator: req.user._id});

  if(req.query.answerType){
    query.where('type', req.query.answerType);
  }

  query.exec(function(err, answers){
    if(err) return next(err)

    return res.send(answers);
  });
};



/**
* GET /api/answers/:id
* retrieve an answer
*/
exports.get = function (req, res, next) {
  return res.send(req.answer);
};


/**
* POST /api/answers
* Create a new answer
params:
{
  questionId: question to answer
  answer: answer content
}
*/
exports.create = function (req, res, next) {
  if(!req.body.questionId) return next(new Error("no question ID specified"));
  if(!req.body.answer) return next(new Error("no answer specified"));

  Question.findById(req.body.questionId, function(err, question){
    if (err)       return next(err);
    if (!question) return next(new Error("can't find question"));

    Answer.create({
      body: req.body.answer,
      creator: req.user._id,
      question: question._id
    }, function(err, answer){
      if (err) return next(err);

      return res.send(answer);
    });
  });

};


/**
* DELETE /api/answers/:id
* retrieve an answer
*/
exports.delete = function (req, res, next) {
  req.answer.remove(function(err, answer){
    if(err) return next(err);

    return res.send(answer);
  });
};



/**
* retrieve an answer
*/
exports.loadAnswer = function(req, res, next, id){
  var query = Answer.findOne({_id: id});

  query.exec(function(err, answer){
    if (err) return next(err);
    if (!answer) return next(new Error("can't find answer"));

    req.answer = answer;
    return next();
  });
};


