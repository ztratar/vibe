var helpers = {},
	_ = require('underscore'),
	AWS = require('aws-sdk'),
	env = process.env.NODE_ENV || 'development',
	config = require('../config/config')[env];

AWS.config.update(config.AWS);

var s3 = new AWS.S3();

helpers.isValidEmail = function(email) {
	var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	return emailRegex.test(email);
};

// Takes in either an error string or mongoose error object
// and returns the error to the API endpoint
helpers.sendError = function(res, error) {
	if (typeof error === 'string') {
		return res.send(500, {
			error: error
		});
	} else {
		if (error.errors) {
			for (var errorField in error.errors) {
				return res.send(500, {
					error: error.errors[errorField].message
				});
			}
		} else {
			return res.send(500, {
				error: 'An error occured'
			});
		}
	}
};

helpers.requireLogin = function(res, req) {
	if (!req.isAuthenticated()) {
		res.send(500, {
			error: 'You must be logged in to do this'
		});
	}
};

helpers.getUsersListString = function(users) {
	var baseUserStr = ''

	if (!users.length) return false;

	if (users.length === 1) {
		baseUserStr = users[0].name;
	} else if (users.length === 2) {
		baseUserStr = users[0].name + ' and ' + users[1].name;
	} else if (users.length === 3) {
		baseUserStr = users[0].name + ', ' + users[1].name + ', and ' + users[2].name;
	} else {
		baseUserStr = users[0].name + ', ' + users[1].name + ', and ' + (users.length-2) + ' others';
	}

	baseUserStr = '<strong>' + _.escape(baseUserStr) + '</strong>';
	if (users.length > 1) {
		return baseUserStr + ' are';
	} else {
		return baseUserStr + ' is';
	}
};

helpers.getNumPeopleString = function(num) {
	if (num === 1) {
		return '1 person';
	} else {
		return num + ' people';
	}
};

helpers.setHostedFile = function(opts, cb) {
	if (!opts.Key || !opts.Body) return false;

	s3.putObject(_.extend({
		Bucket: config.AWS.Bucket
	}, opts), function(err, data) {
		helpers.getHostedFile(opts.Key, cb);
	});
};

helpers.getHostedFile = function(key, cb) {
	s3.getSignedUrl('getObject', {
		Bucket: config.AWS.Bucket,
		Key: key,
		Expires: (60 * 60 * 24 * 365 * 5)
	}, function(err, url) {
		cb(err, url);
	});
};

helpers.security = {

	requireLogin: function(req, res, next) {
		if (req.isAuthenticated()
				&& req.user
				&& req.user.active) {
			next(null, req, res);
		} else {
			req.logout();
			res.redirect('/login');
		}
	},

	requireAdmin: function(req, res, next) {
		helpers.security.requireLogin(req, res, function() {
			if (!req.user.isAdmin) return helpers.sendError(res, 'You must be an admin');
			next(null, req, res);
		});
	},

	requireSuperAdmin: function(req, res, next) {
		helpers.security.requireLogin(req, res, function() {
			if (!req.user.isSuperAdmin) return helpers.sendError(res, 'You cannot do this');
			next(null, req, res);
		});
	}

};

exports = module.exports = helpers;

