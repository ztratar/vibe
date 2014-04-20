
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Async = require('async')
  , User = mongoose.model('User')
  , Question = mongoose.model('Question')
  , Survey = mongoose.model('Survey')
  , Company = mongoose.model('Company')
  , Answer = mongoose.model('Answer');


/**
* POST /surveys
* Create a new survey
* query strings:
*   includeQuestions
*/
exports.index = function(req, res, next){

  var query = Survey.find({company: req.user.company});

  if(req.query.includeQuestions){
    query.populate('questions');
  }

  query.exec(function(err, surveys){
    if(err) return next(err)

    return res.send(surveys);
  });
};



/** 
* GET /surveys/:id
* retrieve a survey
*/
exports.get = function (req, res, next) {
  Survey.findById(req.params['id'], function (err, survey){
    if (err) return next(err);

    return res.send(survey);
  });
};


/**
* POST /surveys
* Create a new survey
* params:
*   name
*/
exports.create = function (req, res, next) {
  if(!req.body.name) return next(new Error("no survey name"));

  Survey.create({
    name: req.body.name,
    creator: req.user._id,
    company: req.user.company
  }, function(err, survey){
    if(err || !survey) return next(new Error("can't create survey"));

    return res.send(survey);
  });

};


/**
* PUT /surveys/:id/:questionId
* Add qustion to survey
*/
exports.addQuestion = function (req, res, next) {

  Survey.findById(req.params['id'], function (err, survey){
    if (err) return next(err);

    Question.findById(req.params['questionId'], function(err, question){
      if (err) return next(err);
      if (!question) return next(new Error("can't find question"));

      survey.questions.addToSet(question._id);
      survey.save(function(err){
        if (err) return next(err);

        return res.send(survey);
      })
    })
  });
};



/**
* DELETE /surveys/:id
* retrieve a survey
*/
exports.delete = function (req, res, next) {
  Survey.findById(req.params['id'], function (err, survey){
    if (err)     return next(err);
    if (!survey) return next(new Error("can't find survey"));

    survey.remove(function(err, survey){
      if(err) return next(err);

      return res.send(survey);
    });
  });

};