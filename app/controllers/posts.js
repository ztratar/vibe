// // Module dependencies.
var mongoose = require('mongoose'),
	Async = require('async'),
	_ = require('underscore'),
	Post = mongoose.model('Post'),
	User = mongoose.model('User'),
	Feedback = mongoose.model('Feedback'),
	live = require('../live'),
	helpers = require('../helpers'),
	app;

/*
 * GET /api/posts
 *
 * Get your post stream
 */
exports.index = function(req, res) {
	var afterId = /afterId=([^&]+)/.exec(req.url),
		beforeId = /beforeId=([^&]+)/.exec(req.url),
		queryObj = {
			for_user: req.user._id,
			active: true
		};

	if (afterId && afterId.length) {
		queryObj._id = { $gt: mongoose.Types.ObjectId(afterId[1]) };
	} else if (beforeId && beforeId.length) {
		queryObj._id = { $lt: mongoose.Types.ObjectId(beforeId[1]) };
	}

	Post
		.find(queryObj)
		.populate('feedback')
		.populate('question')
		.sort({ _id: -1 })
		.limit(10)
		.exec(function(err, posts) {
			if (err) return helpers.sendError(res, err);
			if (!posts.length) return res.send([]);

			var parallelFillFunctions = [];

			// Ensure feedback is stripped of personal
			// info.
			_.each(posts, function(post, ind) {
				if (post.content_type === 'feedback') {
					posts[ind] = posts[ind].withStrippedFeedback(req.user);
				} else if (post.content_type === 'question') {
					(function(post, ind) {
						parallelFillFunctions.push(function(cb) {
							post.withFormattedQuestion(req.user, function(postObj) {
								cb(null, {
									ind: ind,
									post: postObj
								});
							});
						});
					})(post, ind);
				}
			});

			Async.parallel(parallelFillFunctions, function(err, results) {
				_.each(results, function(result) {
					posts[result.ind] = result.post
				});

				res.send(posts);
			});
		});
};

/*
 * INTERNAL
 *
 * Given a piece of feedback, create the posts
 * for the company's users
 */
exports.createPostsFromFeedback = function(res, feedback, cb) {
	// Get company's users
	User.find({
		company: feedback.company,
		active: true
	}, function(err, users) {
		var postObjs = [];
		if (err) return helpers.sendError(res, err);

		_.each(users, function(user) {
			postObjs.push({
				for_user: user._id,
				company: feedback.company,
				content_type: 'feedback',
				feedback: feedback._id
			});
		});

		Post.create(postObjs, function(err) {
			if (err) return helpers.sendError(res, err);

			// Blast out the new posts live
			for (var i = 1; i < arguments.length; i++) {
				if (arguments[i].for_user) {
					arguments[i] = arguments[i].toObject();
					arguments[i].feedback = feedback.stripInfo();
					live.send('/api/users/' + arguments[i].for_user + '/posts', arguments[i]);
				}
			}

			if (cb && typeof cb === 'function') {
				cb(posts);
			}
		});
	});
};

// Cache app object upon first call
module.exports = function(exportedApp) {
	if (exportedApp) app = exportedApp;
	return exports;
};
