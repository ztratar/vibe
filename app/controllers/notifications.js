// Module dependencies.
var mongoose = require('mongoose'),
	_ = require('underscore'),
	Async = require('async'),
	User = mongoose.model('User'),
	Notification = mongoose.model('Notification'),
	helpers = require('../helpers'),
	email = require('./email')(),
	app;

/*
 * GET /api/notifications
 *
 * Get all of your current notifications
 */
exports.index = function(req, res) {
	var afterTime = /afterTime=([^&]+)/.exec(req.url),
		beforeTime = /beforeTime=([^&]+)/.exec(req.url),
		queryObj = {
			for_user: req.user._id
		};

	if (afterTime && afterTime.length) {
		queryObj.time_updated = { $gt: Date.parse(afterTime[1]) };
	} else if (beforeTime && beforeTime.length) {
		queryObj.time_updated = { $lt: Date.parse(beforeTime[1]) };
	}

	Notification
		.find(queryObj)
		.sort({ time_updated: -1 })
		.limit(10)
		.exec(function(err, notifications) {
			if (err) return helpers.sendError(res, err);
			res.send(notifications);
		});
};

/*
 * PUT /api/notifications/mark_read
 *
 * Mark all currently unread notifications as read
 */
exports.markRead = function(req, res) {
	Notification.update({
		for_user: req.user._id,
		read: false
	}, {
		$set: {
			read: true
		}
	}, {
		multi: true
	}, function(err, numAffected) {
		if (err) return helpers.sendError(res, err);
		res.send(200);
	});
};

/* INTERNAL
 *
 * Create helper. Sends the given
 * notification to everyone in the users'
 * company
 */
exports.sendToCompany = function(req, notifOpts, cb) {
	User.find({
		company: req.user.company._id,
		active: true
	}, function(err, users) {
		if (err) return cb(err);
		if (users.length) {
			users = _.pluck(users, '_id');
			exports.sendToUsers(users, notifOpts, cb);
		}
	});
};

/* INTERNAL
 *
 * Create helper. Sends the given
 * notification to all usersIds in the array.
 */
exports.sendToUsers = function(userIds, notifOpts) {
	var functionObjs = [];

	_.each(userIds, function(userId) {
		(function(uId) {
			functionObjs.push(function() {
				exports.send(_.extend({
					for_user: uId
				}, notifOpts));
			});
		})(userId);
	});

	// Blast out all of the notifications o/
	Async.parallel(functionObjs);
};

/*
 * INTERNAL
 *
 * Create helper. This manages clustering proper
 * notifications, pushing messages through
 * pub/sub listeners, etc.
 */
exports.send = function(notifOpts, cb) {
	Async.waterfall([function(asyncCb) {
		if (!notifOpts.cluster_tag) {
			return asyncCb(null, null);
		}

		// Check for notification to cluster
		Notification.findOne({
			cluster_tag: notifOpts.cluster_tag
		}, function(err, notification) {
			if (err) return asyncCb(err);
			asyncCb(null, notification);
		});
	}, function(notification, asyncCb) {
		// If notification exists, get process for clustering
		// based on type
		if (notification) {
			notification.read = false;
			notification.time_updated = Date.now();
			notification.data = notifOpts.data;
			notification.cluster_data = notifOpts.cluster_data;
		} else {
			// If not, create a new notification
			notification = new Notification({
				for_user: notifOpts.for_user,
				img: notifOpts.img,
				type: notifOpts.type,
				data: notifOpts.data,
				cluster_tag: notifOpts.cluster_tag,
				cluster_data: notifOpts.cluster_data
			});
		}
		asyncCb(null, notification);
	}], function(err, notif) {
		if (!notif.verifyData()) {
			return cb("Invalid body data for notification type");
		}

		notif.save(function(err, notification) {
			if (cb && typeof cb === 'function') {
				if (err) return cb(err);
				cb(null, notification);
			}
		});
	});
};

// Cache app object upon first call
module.exports = function(exportedApp) {
	if (exportedApp) app = exportedApp;
	return exports;
};
