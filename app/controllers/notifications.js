// Module dependencies.
var mongoose = require('mongoose'),
	_ = require('underscore'),
	Async = require('async'),
	User = mongoose.model('User'),
	Notification = mongoose.model('Notification'),
	helpers = require('../helpers'),
	email = require('./email')(),
	live = require('../live')(),
	pushController = require('./push'),
	app;

/*
 * GET /api/notifications
 *
 * Get all of your current notifications
 */
exports.index = function(req, res) {
	console.log('-> In notification index controller...', req.user._id);

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
	var prevClusteredNotif;

	Async.waterfall([function(asyncCb) {
		if (!notifOpts.cluster_tag) {
			return asyncCb(null, null);
		}

		// Check for notification to cluster
		Notification.findOne({
			cluster_tag: notifOpts.cluster_tag,
			for_user: notifOpts.for_user
		}, function(err, notification) {
			if (err) return asyncCb(err);
			prevClusteredNotif = notification;
			asyncCb(null, notification);
		});
	}, function(notification, asyncCb) {
		// If notification exists, get process for clustering
		// based on type
		if (notification && notifOpts.cluster_query) {
			if (typeof notifOpts.cluster_query === 'function') {
				notifOpts.cluster_query = notifOpts.cluster_query(notification);
			}

			notifOpts.cluster_query.$set = notifOpts.cluster_query.$set || {};
			notifOpts.cluster_query.$set.read = false;
			notifOpts.cluster_query.$set.time_updated = Date.now();

			notification.update(notifOpts.cluster_query, function(err, numAffected) {
				Notification.findById(notification._id, function(err, notification) {
					asyncCb(null, notification);
				});
			});
		} else {
			if (notification) {
				notification.read = false;
				notification.time_updated = Date.now();
				notification.data = notifOpts.data;
			} else {
				// If not, create a new notification
				notification = new Notification({
					for_user: notifOpts.for_user,
					img: notifOpts.img,
					type: notifOpts.type,
					data: notifOpts.data,
					cluster_tag: notifOpts.cluster_tag
				});
			}

			if (!notification.verifyData()) {
				if (cb) {
					return cb("Invalid body data for notification type");
				} else {
					return;
				}
			}
			notification.save(function(err, notification) {
				asyncCb(null, notification);
			});
		}
	}], function(err, notification) {
		var notifUrl = '/api/users/' + notifOpts.for_user.toString() + '/notifications',
			pushNotif = (typeof notifOpts.push === 'function') ? notifOpts.push(notifOpts.for_user, prevClusteredNotif) : notifOpts.push;

		live.send(notifUrl, notification);

		if (pushNotif) {
			pushController.sendPush({
				userId: notifOpts.for_user.toString(),
				message: notification.getCalculatedData(notifOpts.for_user).notifBody
			});
		}

		if (cb && typeof cb === 'function') {
			if (err) return cb(err);
			cb(null, notification);
		}
	});
};

// Cache app object upon first call
module.exports = function(exportedApp) {
	if (exportedApp) app = exportedApp;
	return exports;
};
