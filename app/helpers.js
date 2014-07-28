var helpers = {},
	mongoose = require('mongoose'),
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

helpers.getUsersListString = function(users, html) {
	var baseUserStr = ''

	html = html || false;

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

	baseUserStr += _.escape(baseUserStr);
	if (html) {
		baseUserStr = '<strong>' + baseUserStr + '</strong>';
	}

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

helpers.base64DecToArr = function(sBase64, nBlocksSize) {
	var sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ""), nInLen = sB64Enc.length,
		nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2, taBytes = new Uint8Array(nOutLen);

	for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
		nMod4 = nInIdx & 3;
		nUint24 |= helpers.b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
		if (nMod4 === 3 || nInLen - nInIdx === 1) {
			for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
				taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
			}
			nUint24 = 0;

		}
	}

	return taBytes;
};

helpers.b64ToUint6 = function(nChr) {
	return nChr > 64 && nChr < 91 ?
			nChr - 65
		: nChr > 96 && nChr < 123 ?
			nChr - 71
		: nChr > 47 && nChr < 58 ?
			nChr + 4
		: nChr === 43 ?
			62
		: nChr === 47 ?
			63
		:
			0;
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

helpers.adminUserOverride = function(req, res, next) {
	var User = mongoose.model('User');
	var Company = mongoose.model('Company');

	if (!req.user) return next();

	if (req.user.isSuperAdmin
			&& req._parsedUrl.query
			&& req._parsedUrl.query.length
			&& req._parsedUrl.query.indexOf('userOverride') !== -1) {

		var userId = /userOverride=([^&]+)/.exec(req._parsedUrl.query);

		User
			.findById(userId[1])
			.populate('company')
			.exec(function(err, user) {
				if (err || !user) return next();

				req.session.fakeUser = user;
				req.session.save();
				req.user = user;

				next();
			});

		return;
	} else if (req._parsedUrl.query
			&& req._parsedUrl.query.length
			&& req._parsedUrl.query.indexOf('resetUser') !== -1) {
		req.session.fakeUser = false;
		req.session.save();
		next();
	} else if (req.session.fakeUser) {
		User
			.findById(req.session.fakeUser._id)
			.populate('company')
			.exec(function(err, user) {
				req.user = user;
				next();
			});
	}
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

