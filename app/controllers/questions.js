
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , MetaQuestion = mongoose.model('MetaQuestion')
  , Question = mongoose.model('Question')
  , Company = mongoose.model('Company');



/**
* GET /questions/:id
* retrieve a question
*/
exports.get = function (req, res) {
  Question.findById(req.params['id'], function (err, question){
    if (err || !question) return res.send(null);

    return res.send(question);
  });
};


/**
* POST /questions/:metaId
* Create a new question
params:
MetaCommentId
*/
exports.create = function (req, res) {
  var metaId = req.params['metaId'];
  var companyId = req.params['companyId'];

  MetaQuestion.findById(metaId, function(err,metaQ){
    if(err || !metaQ) return res.send({error: "can't find question"});

    Company.findById(companyId, function(err, company){
      if(err || !company) return res.send({error: "can't find company"});

      Question.create({
        metaQuestion: metaQ._id,
        body: metaQ.body,
        _creator: req.user._id
      }, function(err, question){
        if(err || !question) return res.send({error: "can't create question"});

        return res.send(question);
      });
    })
  });
};


/**
* DELETE /questions/:id
* retrieve a question
*/
exports.delete = function (req, res) {
  Question.findById(req.params['id'], function (err, question){
    if (err || !question) return res.send({});

    question.remove(function(err, question){
      if(err) return res.send({error: err});

      return res.send(question);
    });
  });

};