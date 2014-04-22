
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Async = require('async')
  , User = mongoose.model('User')
  , MetaQuestion = mongoose.model('MetaQuestion')
  , Question = mongoose.model('Question')
  , Comment = mongoose.model('Comment')
  , Company = mongoose.model('Company')
  , Answer = mongoose.model('Answer');


/**
* GET /questions
* retrieve a list of questions
* query strings:
*   includeAnswers
*   includeData
*/
exports.index = function(req, res, next){

  Question.find({company: req.user.company})
    .exec(function(err, questions){
      if(err) return next(err)

      // populate answers if instructed
      if(req.query.includeAnswers === 'true'){
        Async.map(questions, function(question, done){
          question.getAnswers(function(err, answers){
            if(err) return done(err);

            var t = question.toObject();
            t.answers = answers;
            return done(null, t);
          });

        }, function(err, questions){
          if(err) return next(err);

          return res.send(questions);
        });
      } else {
        return res.send(questions);
      };
    });
};



/** 
* GET /questions/:question
* retrieve a question
*/
exports.get = function (req, res, next) {
  return res.send(req.question);
};


/**
* POST /questions
* Create a new question
* body:
*   metaId: meta_question to copy
*/
exports.create = function (req, res, next) {
  var metaId = req.body['metaId'];

  MetaQuestion.findById(metaId, function(err,metaQ){
    if (err)    return next(err);
    if (!metaQ) return next(new Error("can't find question"));

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
* DELETE /questions/:question
* retrieve a question
*/
exports.delete = function (req, res, next) {
  req.question.remove(function(err, question){
    if(err) return next(err);
    return res.send(question);
  });
};


/**
* GET /questions/:question/comments
* Get comments associated with question
* params:
*   
*/
exports.getComments = function(req, res, next){

  var query = Comment.find({question: req.question._id});

  if(req.query.limit){
    var limit = parseInt(req.query.limit);
    if(!isNaN(limit)) query.limit(limit);
  }

  if(req.query.offset){
    var offset = parseInt(req.query.offset);
    if(!isNaN(offset)) query.skip(offset);
  }


  query.exec(function(err, comments){
    if(err) return next(err);

    return res.send(comments);
  });
};



/**
* POST /questions/:question/comments
* create a new comment
* body:
*   comment: comment
*/
exports.newComment = function(req, res, next){
  if(!req.body.comment) return next(new Error("no comment body"));

  var comment = new Comment({
    question: req.question._id,
    creator: req.user._id,
    body: req.body.comment
  });

  comment.save(function(err, comment){
    if(err) return next(err);

    return res.send(comment);
  });

};



exports.loadQuestion = function(req, res, next, id){
  query = Question.findById(id);

  query.exec(function (err, question){
    if (err) return next(err);
    if (!question) return next(new Error("can't find question"));

    req.question = question;
    return next();
  });
};




