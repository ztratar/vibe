// Module dependencies.
var mongoose = require('mongoose'),
	_ = require('underscore'),
	Async = require('async'),
	User = mongoose.model('User'),
	Post = mongoose.model('Post'),
	MetaQuestion = mongoose.model('MetaQuestion'),
	Question = mongoose.model('Question'),
	QuestionInstance = mongoose.model('QuestionInstance'),
	Chat = mongoose.model('Chat'),
	Company = mongoose.model('Company'),
	Answer = mongoose.model('Answer'),
	live = require('../live')(),
	notificationsController = require('./notifications')(),
	helpers = require('../helpers');

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
		.find({
			company: req.user.company,
			active: true
		})
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
 * GET /api/questions/suggested
 *
 * Return suggested meta questions for company
 * use, transformed into questions
 */
exports.suggested = function(req, res, next) {
	if (!req.user) {
		MetaQuestion.find({
			suggested: true
		}, function(err, meta_questions) {
			if (err) return helpers.sendError(res, err);
			if (!meta_questions.length) {
				return res.send([]);
			}
			return res.send(_.map(meta_questions, function(mQ) {
				return mQ.asQuestion();
			}));
		});
	} else {
		Question.find({
			company: req.user.company,
			active: true
		}, function(err, questions) {
			if (err) return helpers.sendError(res, err);

			var metaQuestionIds = _.pluck(questions, 'meta_question');

			MetaQuestion.find({
				suggested: true,
				_id: { $nin: metaQuestionIds }
			}, function(err, meta_questions) {
				if (err) return helpers.sendError(res, err);
				if (!meta_questions.length) {
					return res.send([]);
				}
				return res.send(_.map(meta_questions, function(mQ) {
					return mQ.asQuestion();
				}));
			});
		});
	}
};

/*
 * GET /questions/:question
 *
 * Retrieve a question
 */
exports.get = function (req, res, next) {

	req.question.withAnswerData({
		_id: req.user._id
	}, function(questionObj) {
		return res.send(questionObj);
	});
};

/*
 * POST /questions
 *
 * Create a new question, either from
 * scratch or from a given meta_question
 *
 * Query params:
 *		meta_question: _id of the meta question to copy
 *		body: body text
 */
exports.create = function (req, res, next) {
	if (!req.user.isAdmin) {
		return helpers.sendError(res, "You dont have privileges to do that");
	}

	if (req.body.meta_question) {
		MetaQuestion.findById(req.body.meta_question, function(err, metaQuestion) {
			if (err) return helpers.sendError(res, err);
			if (!metaQuestion) return helpers.sendError(res, "Meta Question not found");

			Question.findOne({
				meta_question: metaQuestion._id,
				company: req.user.company
			}, function(err, question) {
				if (err) return helpers.sendError(res, err);
				if (question) {
					question.active = true;
					question.save(function(err, question) {
						if (err) return helpers.sendError(res, err);
						return res.send(question);
					});
				} else {
					Question.create({
						meta_question: metaQuestion._id,
						body: metaQuestion.body,
						creator: req.user._id,
						company: req.user.company
					}, function(err, question) {
						if (err) return helpers.sendError(res, err);
						return res.send(question);
					});
				}
			});
		});
	} else {
		// Create from scratch!
		MetaQuestion.create({
			body: req.body.body,
			creator: req.user._id
		}, function(err, metaQuestion) {
			if (err || !metaQuestion) return helpers.sendError(res, err);
			Question.create({
				meta_question: metaQuestion._id,
				body: req.body.body,
				creator: req.user._id,
				company: req.user.company
			}, function(err, question) {
				if (err) return helpers.sendError(res, err);
				return res.send(question);
			});
		});
	}
};

/*
 * POST /api/questions/:question/answer
 *
 * User votes/ansers the given question
 */
exports.createAnswer = function(req, res) {
	Async.waterfall([function(cb) {
		// Check to make sure user hasn't already voted
		// in the latest QuestionInstance of the Question
		QuestionInstance
			.findOne({
				question: req.question._id
			})
			.sort({ _id: -1 })
			.exec(function(err, questionInstance) {
				var usersVotedBefore = questionInstance.users_voted;

				if (err) return cb(err);
				if (questionInstance.didUserAnswer(req.user._id)) {
					return cb('You have already voted');
				}
				questionInstance.answer(req.user, req.body.body, function(err, answer) {
					if (err) return helpers.sendError(res, err);

					// Send notification to those who already voted
					notificationsController.sendToUsers(usersVotedBefore, {
						type: 'question-vote',
						cluster_tag: 'question-vote_' + questionInstance._id,
						data: {
							num_people: questionInstance.users_voted.length,
							question: req.question.body,
							questionId: req.question._id
						}
					});

					cb(null, answer);

					// Blast the question to the top of everyone's feed
					// as it grown in popularity
					var triggerBlasts = [
						Math.floor(questionInstance.num_sent_to * 0.75),
						Math.floor(questionInstance.num_sent_to * 0.5),
						Math.floor(questionInstance.num_sent_to * 0.25)
					];
					if (_.contains(triggerBlasts, questionInstance.num_completed+1)) {
						exports.createPostsForQuestion(req, req.question);
					}
				});
			});
	}], function(err, answer) {
		if (err) return helpers.sendError(res, err);
		res.send(200, answer);
	});
};

/*
 * PUT /questions/:question
 *
 * Update a question, usually used to make
 * inactive.
 */
exports.update = function (req, res, next) {
	if (req.body.active !== undefined) req.question.active = req.body.active;
	if (req.body.send_on_days !== undefined) req.question.send_on_days = req.body.send_on_days;

	req.question.save(function(err, question){
		if (err) return next(err);
		return res.send(question);
	});
};

/*
 * GET /api/questions/:question/chats
 *
 * Get comment associated with question
 */
exports.getChats = function(req, res, next){
	var afterId = /afterId=([^&]+)/.exec(req.url),
		beforeId = /beforeId=([^&]+)/.exec(req.url),
		queryObj = {
			question: req.question._id
		};

	if (afterId && afterId.length) {
		queryObj._id = { $gt: mongoose.Types.ObjectId(afterId[1]) };
	} else if (beforeId && beforeId.length) {
		queryObj._id = { $lt: mongoose.Types.ObjectId(beforeId[1]) };
	}

	req.question.markChatEntered(req.user);

	Chat
		.find(queryObj)
		.limit(10)
		.sort({ _id: -1 })
		.exec(function(err, chats) {
			if (err) return helpers.sendError(res, err);
			res.send(200, _.map(chats, function(chat) { return chat.stripInfo(); }));
		});
};

/*
 * PUT /api/question/:question/leave_chat
 *
 * Marks that the user has left the chat room
 */
exports.leaveChatRoom = function(req, res, next) {
	req.question.leaveChat(req.user);
	res.send(req.question);
};


/*
 * POST /api/questions/:question/chats
 *
 * Create a new chat
 *
 * Query params:
 * 		body (string): the chat message
 */
exports.newChat = function(req, res, next){
	Chat.create({
		creator: {
			ref: req.user._id,
			name: req.user.name,
			avatar: req.user.avatar
		},
		question: req.question._id,
		body: req.body.body
	}, function(err, chat) {
		if (err) return helpers.sendError(res, err);

		var sendNotificationsTo = _.filter(req.question.chat.users_participating, function(user) {
			return (user.toString() !== req.user._id.toString());
		});

		req.question.incrementUnreadCountsAndMarkParticipation(req.user);

		live.send('/api/questions/' + req.question._id + '/chats', chat);

		res.send(chat.stripInfo());

		notificationsController.sendToUsers(sendNotificationsTo, {
			type: 'question-chat',
			cluster_tag: 'question-chat_' + req.question._id,
			cluster_query: function(notification) {
				var users = notification.data.users,
					baseQuery = {
						$set: {
							'data.first_user_id': req.user._id
						}
					};

				if (!_.contains(_.map(users, function(user) {
					return user._id.toString();
				}), req.user._id.toString())) {
					baseQuery.$addToSet = {
						'data.users': {
							_id: req.user._id.toString(),
							avatar: req.user.avatar,
							name: req.user.name
						}
					};
				}

				return baseQuery;
			},
			data: {
				users: [{
					_id: req.user._id,
					avatar: req.user.avatar,
					name: req.user.name
				}],
				first_user_id: req.user._id,
				questionId: req.question._id,
				question: req.question.body
			}
		});
	});
};

/*
 * POST /questions/:question/send_now
 *
 * Send the given question out to the company
 * right now!
 */
exports.sendNow = function(req, res, next) {
	return exports.send(req, res, null, function(err, posts) {
		if (err) return helpers.sendError(res, err);

		if (posts !== null) {
			res.send(200);
		} else {
			res.send(500, {
				error: "No posts created"
			});
		}
	});
};

/*
 * INTERNAL
 *
 * Blast out a question to the company.
 */
exports.send = function(req, res, questionId, next) {
	// Figure out which question to send
	Async.waterfall([function(cb) {
		if (questionId) {
			Question.findById(function(err, question) {
				if (err) return cb(err);
				cb(null, question);
			});
		} else {
			cb(null, req.question);
		}
	}, function(question, cb) {
		var oneday = 1000 * 60 * 60 * 24;
		if (Date.now() - Date.parse(question.time_last_sent) < oneday) {
			return cb('This question was already sent today. Please wait until tomorrow');
		}
		cb(null, question);
	}, function(question, cb) {
		// Get the users who should be sent the question
		User.find({
			company: question.company.toString(),
			active: true
		}, function(err, users) {
			if (err) return cb(err);
			cb(null, question, users);
		});
	}], function(err, question, users) {
		if (err) return next(err);

		// Create QuestionInstance Object
		QuestionInstance.create({
			users_sent_to: _.pluck(users, '_id'),
			question: question._id,
			num_sent_to: users.length
		}, function(err, questionInstance) {
			question.time_last_sent = Date.now();
			question.user_last_sent = req.user.name;
			question.save();

			notificationsController.sendToCompany(req, {
				type: 'question',
				img: req.user.avatar,
				data: {
					user: req.user.name,
					question: question.body,
					questionId: question._id
				}
			});

			exports.createPostsForQuestion(null, question, users);

			if (typeof next === 'function') next(null, { status: 'success' });
		});
	});
};

exports.createPostsForQuestion = function(req, question, users, next) {
	Async.waterfall([function(cb) {
		if (users && users.length) {
			cb(null, users);
		} else {
			// If users aren't already loaded, get the proper users
			User.find({
				company: question.company.toString(),
				active: true
			}, function(err, users) {
				if (err) return cb(err);
				cb(null, users);
			});
		}
	}], function(err, users) {
		// Create Posts for Question
		var postObjs = [];
		if (err) return;

		_.each(users, function(user) {
			postObjs.push({
				for_user: user._id,
				company: question.company,
				content_type: 'question',
				question: question._id
			});
		});

		Post.update({
			question: question._id
		}, {
			$set: {
				active: false
			}
		}, {
			multi: true
		}, function(err, numAffected) {
			Post.create(postObjs, function(err, posts) {
				// Blast out the new posts live
				_.each(arguments, function(arg, i) {
					if (arg && arg.for_user) {
						arg = arg.toObject();
						question.withAnswerData({
							_id: arg.for_user
						}, function(questionObj) {
							arg.question = questionObj;
							if (!req || arg.for_user.toString() !== req.user._id.toString()) {
								live.send('/api/users/' + arg.for_user + '/posts', arg);
							}
						});
					}
				});

				if (typeof next === 'function') next(null, posts);
			});
		});
	});
};

// Cache app object upon first call
module.exports = function(exportedApp) {
	if (exportedApp) app = exportedApp;
	return exports;
};
