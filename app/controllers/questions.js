// Module dependencies.
var mongoose = require('mongoose'),
	Async = require('async'),
	User = mongoose.model('User'),
	MetaQuestion = mongoose.model('MetaQuestion'),
	Question = mongoose.model('Question'),
	Comment = mongoose.model('Comment'),
	Company = mongoose.model('Company'),
	Answer = mongoose.model('Answer');

/*
 * PARAM LOAD - Question
 *
 * Called when API matches and executed before other
 * API call, this will load the Question object and
 * store as part of the request.
 */
exports.loadQuestion = function(req, res, next, id){
	query = Question.findById(id);

	query.exec(function (err, question){
		if (err) return next(err);
		if (!question) return next(new Error("can't find question"));
		req.question = question;
		return next();
	});
};

/*
 * GET /questions
 *
 * Retrieve a list of questions
 *
 * Option vars:
 * 		includeAnswers (Boolean)
 * 		includeData (Boolean)
 */
exports.index = function(req, res, next){
	Question
		.find({company: req.user.company})
		.exec(function(err, questions){
			if(err) return next(err);

			// populate answers if instructed
			Async.map(questions, function(question, done){
				var leanQuestion = question.toObject();
				Async.waterfall(
					[function(cb){
						if (req.query.includeAnswers === 'true') {
							question.getAnswers(function(err, answers){
								if(err) return cb(err);
								return cb(null, answers);
							});
						} else {
							return cb(null, null);
						}
					},
					function(answers, cb){
						if(req.query.includeData === 'true'){
							question.calculateData(function(err, data){
								if(err) return cb(err);

								return cb(null, answers, data);
							});
						} else {
							return cb(null, answers, null);
						}
					}],
					function(err, answers, data){
						if(err) return done(err);
						if(answers) leanQuestion.answers = answers;
						if(data) leanQuestion.data = data;
						return done(null, leanQuestion);
					}
				);
			}, function(err, questions){
				if(err) return next(err);
				return res.send(questions);
			});
		});
};

/*
 * GET /questions/:question
 *
 * Retrieve a question
 */
exports.get = function (req, res, next) {
	return res.send(req.question);
};

/*
 * POST /questions
 *
 * Create a new question
 *
 * Query params:
 *		metaId: _id of the meta_question to copy
 */
exports.create = function (req, res, next) {
	var metaId = req.body['metaId'];

	MetaQuestion.findById(metaId, function(err,metaQ){
		if (err)		return next(err);
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

/*
 * PUT /questions/:question
 *
 * Update a question
 */
exports.update = function (req, res, next) {
	if(req.body.active) req.question.active = req.body.active;

	req.question.save(function(err, question){
		if (err) return next(err);

		return res.send(question);
	})

};

/*
 * DELETE /questions/:question
 *
 * Retrieve a question
 */
exports.delete = function (req, res, next) {
	req.question.remove(function(err, question){
		if(err) return next(err);
		return res.send(question);
	});
};

/*
 * GET /questions/:question/comments
 *
 * Get comments associated with question
 */
exports.getComments = function(req, res, next){
	var query = Comment.find({question: req.question._id});

	if (req.query.limit){
		var limit = parseInt(req.query.limit);
		if(!isNaN(limit)) query.limit(limit);
	}

	if (req.query.offset){
		var offset = parseInt(req.query.offset);
		if(!isNaN(offset)) query.skip(offset);
	}

	query.exec(function(err, comments){
		if(err) return next(err);
		return res.send(comments);
	});
};

/*
 * POST /questions/:question/comments
 *
 * Create a new comment
 *
 * Query params:
 *		comment (String): comment body
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

// Cache app object upon first call
module.exports = function(exportedApp) {
	if (exportedApp) app = exportedApp;
	return exports;
};
