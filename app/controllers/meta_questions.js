
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
exports.get = function (req, res) {
  MetaQuestion.findById(req.params['id'], function (err, question){
    if (err || !question) return res.send(null);

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
exports.create = function (req, res) {
  if(!req.body.question) res.send({error: "no question specified"});
  MetaQuestion.create({
    body: req.body.question,
    _creator: req.user._id
  }, function(err, question){
    if(err || !question) return res.send({error: "can't create meta question"});

    return res.send(question);
  });
};


/**
* DELETE /meta_questions/:id
* retrieve a question
*/
exports.delete = function (req, res) {
  MetaQuestion.findById(req.params['id'], function (err, question){
    if (err || !question) return res.send({});

    question.remove(function(err, question){
      if(err) return res.send({error: err});

      return res.send(question);
    });
  });

};