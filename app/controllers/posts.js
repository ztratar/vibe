// // Module dependencies.
var mongoose = require('mongoose'),
	Async = require('async'),
	_ = require('underscore'),
	Post = mongoose.model('Post'),
	User = mongoose.model('User'),
	Feedback = mongoose.model('Feedback'),
	helpers = require('../helpers'),
	app;

/*
 * GET /api/posts
 *
 * Get your post stream
 */
exports.index = function(req, res) {
	Post
		.find({
			for_user: req.user._id
		})
		.populate('feedback')
		.populate('question')
		.exec(function(err, posts) {
			if (err) return helpers.sendError(res, err);
			if (!posts.length) return res.send([]);

			res.send(posts);
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
				body: feedback.body,
				content_type: 'feedback',
				feedback: feedback._id
			});
		});

		Post.create(postObjs, function(err, posts) {
			if (err) return helpers.sendError(res, err);
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
