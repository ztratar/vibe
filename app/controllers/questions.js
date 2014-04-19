
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , Question = mongoose.model('Question');



/**
* GET /questions/:id
* retrieve a question
*/
exports.get = function (req, res) {
  Question
    .findOne({ _id: req.params['id']})
    .exec(function (err, question){
      if (err) return next(err);
      if (!question){
        res.send({question: null});
      } else {
        res.send({question: question});
      }
    })
};


/**
* POST /questions/:metaId
* Create a new question
params:
MetaCommentId
*/
exports.create = function (req, res) {
  var metaId = req.params['metaId'];
  MetaQuestion.findById(metaId, function(err,metaQ){
    if(err || !metaQ) return res.send({error: "can't find meta question"});
    
    Question.create({
      metaQuestion: metaQ._id,
      body: metaQ.body,
      _creator: req.user._id
    }, function(err, question){
      if(err || !question) return res.send({error: "can't create question"});

      return res.send(question);
    })

  });
};


/**
* DELETE /questions/:id
* retrieve a question
*/
exports.delete = function (req, res) {
  Question
    .findOne({ _id: req.params['id']})
    .exec(function (err, question){
      if (err) return next(err);
      if (!question){
        res.send({question: null});
      } else {
        question.remove(function(err, question){
          if(err) return next(err);
          res.send(question);
        })
      }
    })

};