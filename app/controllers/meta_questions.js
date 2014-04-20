
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , MetaQuestion = mongoose.model('MetaQuestion')
  , Question = mongoose.model('Question');


/**
* GET /questions
* retrieve a list of questions
* query strings:
*/
exports.index = function(req, res, next){

  MetaQuestion.find({})
    .lean()
    .exec(function(err, questions){
      if(err) return next(err)

      return res.send(questions);
    });
};

/**
* GET /meta_questions/:meta_question
* retrieve a question
*/
exports.get = function (req, res, next) {
  return res.send(req.meta_question);
};


/**
* POST /meta_questions
* Create a new meta question
params:
{
  question: question content
}
*/
exports.create = function (req, res, next) {
  if(!req.body.question) return next(new Error("no question specified"));

  MetaQuestion.create({
    body: req.body.question,
    creator: req.user._id
  }, function(err, question){
    if (err)      return next(err);
    if(!question) return next(new Error("can't create meta question"));

    return res.send(question);
  });
};


/**
* DELETE /meta_questions/:meta_question
* retrieve a question
*/
exports.delete = function (req, res, next) {
  req.meta_question.remove(function(err, question){
    if(err) return next(err);
    return res.send(question);
  });
};




exports.loadMetaQuestion = function(req, res, next, id){
  MetaQuestion.findById(id, function (err, question){
    if (err) return next(err);
    if (!question) return next(new Error("can't find meta question"));


    req.meta_question = question;
    return next();
  });
};