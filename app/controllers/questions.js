
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Async = require('async')
  , User = mongoose.model('User')
  , MetaQuestion = mongoose.model('MetaQuestion')
  , Question = mongoose.model('Question')
  , Company = mongoose.model('Company');



exports.index = function(req, res, next){

  Question.find({})


  if(req.query.includeAnswers) return res.send();



};



/** 
* GET /questions/:id
* retrieve a question
*/
exports.get = function (req, res, next) {
  Question.findById(req.params['id'], function (err, question){
    if (err || !question) return next(new Error("can't find question"));

    return res.send(question);
  });
};


/**
* POST /questions/:metaId
* Create a new question
params:
MetaCommentId
*/
exports.create = function (req, res, next) {
  var metaId = req.params['metaId'];

  MetaQuestion.findById(metaId, function(err,metaQ){
    if(err || !metaQ) return next(new Error("can't find question"));

    Question.create({
      metaQuestion: metaQ._id,
      body: metaQ.body,
      creator: req.user._id,
      company: req.user.company
    }, function(err, question){
      if(err || !question) return next(new Error("can't create question"));

      return res.send(question);
    });

  });
};


/**
* DELETE /questions/:id
* retrieve a question
*/
exports.delete = function (req, res, next) {
  Question.findById(req.params['id'], function (err, question){
    if (err || !question) return next(new Error("can't find company"));

    question.remove(function(err, question){
      if(err) return res.send({error: err});

      return res.send(question);
    });
  });

};