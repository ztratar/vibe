
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , MetaQuestion = mongoose.model('MetaQuestion')
  , Question = mongoose.model('Question');



/**
* GET /meta_questions/:id
* retrieve a question
*/
exports.get = function (req, res, next) {
  MetaQuestion.findById(req.params['id'], function (err, question){
    if (err || !question) return next(new Error("can't find meta question"));

    return res.send(question);
  });
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
    if(err || !question) return next(new Error("can't create meta question"));

    return res.send(question);
  });
};


/**
* DELETE /meta_questions/:id
* retrieve a question
*/
exports.delete = function (req, res, next) {
  MetaQuestion.findById(req.params['id'], function (err, question){
    if (err || !question) return next(new Error("can't find meta question"));

    question.remove(function(err, question){
      if(err) return next(err);

      return res.send(question);
    });
  });

};