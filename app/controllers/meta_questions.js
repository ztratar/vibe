// Module dependencies.
var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Async = require('async'),
	MetaQuestion = mongoose.model('MetaQuestion'),
	Question = mongoose.model('Question'),
	app;

/*
 * PARAM LOAD - MetaQuestion
 *
 * Called when API matches and executed before other
 * API call, this will load the MetaQuestion object and
 * store as part of the request.
 */
exports.loadMetaQuestion = function(req, res, next, id){
	MetaQuestion.findById(id, function (err, question){
		if (err) return next(err);
		if (!question) return next(new Error("can't find meta question"));
		req.meta_question = question;
		return next();
	});
};

/*
 * GET /meta_questions
 *
 * Retrieve a list of meta_questions
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
				Async.map(
					metaQuestions,
					function(meta_question, done){
						Async.detect(
							questions,
							function(question, done2){
								return done2(meta_question._id.equals(question.metaQuestion));
							},
							function(question){
								if(question){
									meta_question.selected = true;
									meta_question.active = question.active;
								}

								return done(null, meta_question);
							}
						);
					},
					function(err, metaQuestions){
						if(err) return next(err);
						return res.send(metaQuestions);
					}
				);
			});
		} else {
			return res.send(metaQuestions);
		}
	});
};

/*
 * GET /meta_questions/:meta_question
 *
 * Retrieve a MetaQuestion
 */
exports.get = function (req, res, next) {
	return res.send(req.meta_question);
};


/*
 * POST /meta_questions
 *
 * Create a new MetaQuestion
 *
 * Options:
 * 		question (String): question body
 */
exports.create = function (req, res, next) {
	if(!req.body.question) return next(new Error("no question specified"));

	MetaQuestion.create({
		body: req.body.question,
		creator: req.user._id
	}, function(err, question){
		if (err) return next(err);
		if(!question) return next(new Error("can't create meta question"));
		return res.send(question);
	});
};

// Cache app object upon first call
module.exports = function(exportedApp) {
	if (exportedApp) app = exportedApp;
	return exports;
};
