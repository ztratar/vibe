
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
* GET /surveys
* get all surveys
* query strings:
*   includeQuestions
*   dueDate
*/
exports.index = function(req, res, next){

  var query = Survey.find({recipient: req.user._id});

  if(req.query.dueDate){
    query.$lte('dueDate', req.query.dueDate)
  }

  if(req.query.includeQuestions === 'true'){
    query.populate('questions');
  }

  query.exec(function(err, surveys){
    if(err) return next(err)

    return res.send(surveys);
  });
};



/** 
* GET /surveys/:survey
* retrieve a survey
*/
exports.get = function (req, res, next) {
  return res.send(req.survey);
};


/**
* POST /surveys
* Create a new survey
* params:
*   name
*   dueDate
*/
exports.create = function (req, res, next) {
  if(!req.body.name) return next(new Error("no survey name"));
  if(!req.body.dueDate) return next(new Error("no due date"));

  Survey.create({
    name: req.body.name,
    dueDate: req.body.dueDate,
    creator: req.user._id,
    company: req.user.company
  }, function(err, survey){
    if(err || !survey) return next(new Error("can't create survey"));

    return res.send(survey);
  });

};


/**
* PUT /surveys/:survey/:question
* Add qustion to survey
*/
exports.addQuestion = function (req, res, next) {
  req.survey.questions.addToSet(req.question._id);
  req.survey.save(function(err){
    if (err) return next(err);

    return res.send(req.survey);
  })

};



/**
* DELETE /surveys/:survey
* retrieve a survey
*/
exports.delete = function (req, res, next) {
  req.survey.remove(function(err, survey){
    if(err) return next(err);
    return res.send(survey);
  });
};


exports.loadSurvey = function(req, res, next, id){
  var query = Survey.findOne({_id: id});

  query.exec(function(err, survey){
    if (err) return next(err);
    if (!survey) return next(new Error("can't find survey"));

    req.survey = survey;
    return next();
  });
};







