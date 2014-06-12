// Module dependencies.
var mongoose = require('mongoose'),
	Async = require('async'),
	_ = require('underscore'),
	Feedback = mongoose.model('Feedback'),
	helpers = require('../helpers'),
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
 * GET /api/feedback/pending
 *
 * If admin, get all feedbacks pending
 * approval. If not admin, return your own pending
 * feedbacks.
 */
exports.pending = function(req, res) {
	Async.waterfall([function(cb) {
		if (req.user.isAdmin) {
			Feedback.find({
				company: req.user.company._id,
				status: 'pending'
			}, function(err, feedbacks) {
				cb(err, feedbacks);
			});
		} else {
			Feedback.find({
				creator: req.user._id,
				company: req.user.company._id,
				status: 'pending'
			}, function(err, feedbacks) {
				cb(err, feedbacks);
			});
		}
	}], function(err, feedbacks) {
		if (err) return helpers.sendError(res, err);

		res.send(_.map(feedbacks, function(feedback) {
			return feedback.stripInfo();
		}));
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
		return res.send(feedback.stripInfo());
	});
};

/*
 * PUT /api/feedback/:feedback
 *
 * Update feedback. Used to approve and disapprove
 * of individual items.
 *
 * Query vars:
 *  	approved (Boolean): The feedback should be approved
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
		} else if (req.body.status === 'rejected') {
			exports.disapprove(req, res, next);
		} else {
			res.send({
				error: 'Approval must be rejected or approved'
			});
		}
	} else {
		res.send(req.feedback.stripInfo());
	}
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
		res.send(feedback.stripInfo());
	});
};

/*
 * INTERNAL
 *
 * Admins disapprove of the feedback with a
 * given reason, which is then notified to the
 * creator. If the feedback was already approved,
 * the posts sent out will be retraced and chat
 * calls disabled.
 */
exports.disapprove = function(req, res, next) {
	if (!req.user.isAdmin) {
		return res.send({
			error: 'You must be an admin to do this'
		});
	}

	req.feedback.status = 'rejected';
	req.feedback.status_changed_by = req.user._id;
	req.feedback.time_status_changed = Date.now();

	req.feedback.save(function(err, feedback) {
		if (err) return helpers.sendError(res, err);
		res.send(feedback.stripInfo());
	});
};

// Cache app object upon first call
module.exports = function(exportedApp) {
	if (exportedApp) app = exportedApp;
	return exports;
};
