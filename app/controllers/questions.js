
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
* POST /questions
* Create a new question
*/
exports.create = function (req, res) {

};


/**
* DELETE /questions/:id
* retrieve a question
*/
exports.delete = function (req, res) {

};