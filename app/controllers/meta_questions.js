
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , Async = require('async')
  , MetaQuestion = mongoose.model('MetaQuestion')
  , Question = mongoose.model('Question');


/**
* GET /meta_questions
* retrieve a list of meta_questions
* query strings:
*/
exports.index = function(req, res, next){
  query = MetaQuestion.find({});
  query.lean();
  query.exec(function(err, metaQuestions){
      if(err) return next(err);

      // check to see if we need to diff against the company
      if(req.query.populateDiffs === "true"){
        Question.find({company: req.user.company}, function(err, questions){
          if(err) return next(err);

          Async.map(metaQuestions,
            function(meta_question, done){

              Async.detect(questions,
                function(question, done2){
                  return done2(meta_question._id.equals(question.metaQuestion));
                },
                function(question){
                  if(question){
                    meta_question.selected = true;
                    meta_question.active = question.active;
                  }

                  return done(null, meta_question);
                });

            },
            function(err, metaQuestions){
              if(err) return next(err);

              return res.send(metaQuestions);
            });

        });
      } else {
        return res.send(metaQuestions);
      }
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