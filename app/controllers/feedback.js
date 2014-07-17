// Module dependencies.
var mongoose = require('mongoose'),
	Async = require('async'),
	_ = require('underscore'),
	Post = mongoose.model('Post'),
	Chat = mongoose.model('Chat'),
	Feedback = mongoose.model('Feedback'),
	postsController = require('./posts')(),
	notificationsController = require('./notifications')(),
	helpers = require('../helpers'),
	live = require('../live')(),
	app;

/*
 * PARAM LOAD - Feedback
 *
 * Called when API matches and executed before other
 * API call, this will load the Feedback object and
 * store as part of the request.
 */
exports.loadFeedback = function(req, res, next, id) {
	Feedback.findById(id, function(err, feedback) {
		if (err) return next(err);
		if (!feedback) return helpers.sendError(res, "Couldn't find that feedback");
		req.feedback = feedback;
		return next();
	});
};

/*
 * GET /api/feedback/:feedback
 *
 * Get a stripped feedback object
 */
exports.get = function(req, res) {
	return res.send(req.feedback.stripInfo(req.user));
};

/*
 * GET /api/feedback/pending
 *
 * If admin, get all feedbacks pending
 * approval. If not admin, return your own pending
 * feedbacks.
 */
exports.pending = function(req, res) {
	Async.waterfall([function(cb) {
		Feedback.find({
			company: req.user.company._id,
			status: 'pending'
		}, function(err, feedbacks) {
			cb(err, feedbacks);
		});
	}], function(err, feedbacks) {
		if (err) return helpers.sendError(res, err);

		res.send(_.map(feedbacks, function(feedback) {
			return feedback.stripInfo(req.user);
		}));
	});
};

/*
 * GET /api/feedback/:feedback/chats
 *
 * Get comment associated with feedback
 */
exports.getChats = function(req, res, next){
	var afterId = /afterId=([^&]+)/.exec(req.url),
		beforeId = /beforeId=([^&]+)/.exec(req.url),
		queryObj = {
			feedback: req.feedback._id
		};

	if (afterId && afterId.length) {
		queryObj._id = { $gt: mongoose.Types.ObjectId(afterId[1]) };
	} else if (beforeId && beforeId.length) {
		queryObj._id = { $lt: mongoose.Types.ObjectId(beforeId[1]) };
	}

	req.feedback.markChatEntered(req.user);

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
 * PUT /api/feedback/:feedback/leave_chat
 *
 * Marks that the user has left the chat room
 */
exports.leaveChatRoom = function(req, res, next) {
	req.feedback.leaveChat(req.user);
	res.send(req.feedback.stripInfo(req.user));
};

/*
 * POST /api/feedback/:feedback/chats
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
		feedback: req.feedback._id,
		body: req.body.body
	}, function(err, chat) {
		if (err) return helpers.sendError(res, err);

		var sendNotificationsTo = _.filter(req.feedback.chat.users_participating, function(user) {
			return (user.toString() !== req.user._id.toString());
		});

		req.feedback.incrementUnreadCountsAndMarkParticipation(req.user);

		live.send('/api/feedback/' + req.feedback._id + '/chats', chat);

		res.send(chat.stripInfo());

		notificationsController.sendToUsers(sendNotificationsTo, {
			type: 'feedback-chat',
			cluster_tag: 'feedback-chat_' + req.feedback._id,
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
				feedbackId: req.feedback._id,
				feedback: req.feedback.body
			}
		});
	});
};

/*
 * POST /api/feedback
 *
 * Creates a new piece of unapproved feedback
 * and returns the safe, anonymous object
 *
 * Query vars:
 *  	body (String): The textual feedback
 */
exports.create = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.send({
			error: 'You must be logged in to do this'
		});
	}

	Feedback.create({
		body: req.body.body,
		creator: req.user._id,
		company: req.user.company,
		num_votes: 1,
		votes: [req.user._id]
	}, function(err, feedback) {
		if (err) return helpers.sendError(res, err);

		live.send('/api/feedback/pending', feedback.stripInfo());

		return res.send(feedback.stripInfo(req.user));
	});
};

/*
 * PUT /api/feedback/:feedback
 *
 * Update feedback. Used to send and archive
 * of individual items.
 *
 * Query vars:
 *  	status (String): The feedback should be sent or archived
 */
exports.update = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.send({
			error: 'You must be logged in to do this'
		});
	}

	if (!req.user.isAdmin) {
		return res.send({
			error: 'You must be an admin to do this'
		});
	}

	if (req.body.status !== undefined
			&& req.body.status !== req.feedback.status) {
		if (req.body.status === 'approved') {
			exports.approve(req, res, next);
		} else if (req.body.status === 'archived') {
			exports.archive(req, res, next);
		} else {
			res.send({
				error: 'Approval must be archived or sent out'
			});
		}
	} else {
		res.send(req.feedback.stripInfo(req.user));
	}
};

/*
 * PUT /api/feedback/:feedback/agree
 *
 * Agree with this feedback, which increments
 * the score.
 */
exports.agree = function(req, res, next) {
	if (req.feedback.didUserVote(req.user._id)) {
		return res.send(500, {
			error: "You've already agreed with this"
		});
	}

	var usersAgreedBefore = req.feedback.votes;

	req.feedback.update({
		$inc: {
			num_votes: 1
		},
		$push: {
			votes: req.user._id
		}
	}, {
		w: 1
	}, function(err, feedback) {
		if (err) helpers.sendError(res, err);

		Feedback.findById(req.feedback._id, function(err, feedback) {

			notificationsController.sendToUsers(usersAgreedBefore, {
				type: 'feedback-agree',
				cluster_tag: 'feedback-agree_' + feedback._id,
				data: {
					num_people: feedback.num_votes,
					feedback: feedback.body,
					feedbackId: feedback._id
				}
			});

			res.send(feedback.stripInfo(req.user));

			// Blast the feedback to the top of everyone's feed
			// as it grown in popularity
			var triggerBlasts = [
				Math.floor(req.user.company.size * 0.75),
				Math.floor(req.user.company.size * 0.5),
				Math.floor(req.user.company.size * 0.25)
			];
			if (_.contains(triggerBlasts, feedback.num_votes)) {
				postsController.createPostsFromFeedback(req, res, feedback);
			}

			live.send('/api/feedback/' + req.feedback._id + '/vote_change', feedback.num_votes);
		});
	});
};

/*
 * PUT /api/feedback/:feedback/undo_agree
 *
 * Reverse your decision to agree with feedback.
 */
exports.undoAgree = function(req, res, next) {
	if (!req.feedback.didUserVote(req.user._id)) {
		return res.send(500, {
			error: "You already don't agree with this"
		});
	}

	req.feedback.update({
		$inc: {
			num_votes: -1
		},
		$pull: {
			votes: req.user._id
		}
	}, {
		w: 1
	}, function(err, feedback, test, z) {
		if (err) helpers.sendError(res, err);
		Feedback.findById(req.feedback._id, function(err, feedback) {
			res.send(feedback.stripInfo(req.user));

			live.send('/api/feedback/' + req.feedback._id + '/vote_change', feedback.num_votes);
		});
	});
};

/*
 * DELETE /api/feedback/:feedback
 *
 * If admin, delete this feedback and its
 * associated posts/chats.
 */
exports.delete = function(req, res) {
	if (!req.user.isAdmin) {
		return res.send(500, {
			error: "You must be an admin to do this"
		});
	}

	if (req.user.company._id.toString() !== req.feedback.company.toString()) {
		return res.send(500, {
			error: "You don't have permission to do this"
		});
	}

	req.feedback.status = 'pulled';
	req.feedback.status_changed_by = req.user._id;
	req.feedback.time_status_changed = Date.now();

	req.feedback.save(function(err, feedback) {
		if (err) return helpers.sendError(res, err);

		Post.remove({
			feedback: feedback._id
		}, function(err) {
			if (err) return helpers.sendError(res, err);

			// TODO: Remove chats

			return res.send(200);
		});
	});
};

/*
 * INTERNAL
 *
 * Admins approve the given feedback by the
 * id. This then delivers the feedback
 * to the associated post feeds of the users.
 */
exports.approve = function(req, res, next) {
	if (!req.user.isAdmin) {
		return res.send({
			error: 'You must be an admin to do this'
		});
	}

	req.feedback.status = 'approved';
	req.feedback.status_changed_by = req.user._id;
	req.feedback.time_status_changed = Date.now();

	req.feedback.save(function(err, feedback) {
		if (err) return helpers.sendError(res, err);

		live.send('/api/feedback/decided', feedback.stripInfo());

		res.send(feedback.stripInfo(req.user));

		postsController.createPostsFromFeedback(null, res, feedback);

		notificationsController.send({
			for_user: req.feedback.creator,
			type: 'feedback-approved'
		});
	});
};

/*
 * INTERNAL
 *
 * Admins archive of the feedback with an options
 * given reason, which is then notified to the
 * creator. If the feedback was already approved,
 * the posts sent out will be retraced and chat
 * calls disabled.
 */
exports.archive = function(req, res, next) {
	if (!req.user.isAdmin) {
		return res.send(500, {
			error: 'You must be an admin to do this'
		});
	}

	req.feedback.status = 'archived';
	req.feedback.status_change_reason = req.body.status_change_reason;
	req.feedback.status_changed_by = req.user._id;
	req.feedback.time_status_changed = Date.now();

	req.feedback.save(function(err, feedback) {
		if (err) return helpers.sendError(res, err);

		live.send('/api/feedback/decided', feedback.stripInfo());

		notificationsController.send({
			for_user: req.feedback.creator,
			type: 'feedback-archived',
			data: {
				reason: req.body.status_change_reason
			}
		});

		res.send(feedback.stripInfo(req.user));
	});
};

// Cache app object upon first call
module.exports = function(exportedApp) {
	if (exportedApp) app = exportedApp;
	return exports;
};
