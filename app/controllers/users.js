// Module dependencies.
var mongoose = require('mongoose'),
	_ = require('underscore'),
	User = mongoose.model('User'),
	Company = mongoose.model('Company'),
	AccessRequest = mongoose.model('AccessRequest'),
	UserInvite = mongoose.model('UserInvite'),
	Async = require('async'),
	crypto = require('crypto'),
	email = require('./email')(),
	helpers = require('../helpers'),
	app,
	passport;

/*
 * POST /api/login
 *
 * Log the user in if they send the proper credientials.
 * Uses the passport module, which has docs at
 * http://passportjs.org/guide
 *
 * Query vars:
 *  	email (String)
 *  	password (String)
 */
exports.login = function (req, res) {
	req.body.email = req.body.email.toLowerCase();
	passport.authenticate('local', function(err, user, info) {
		if (err || !user) {
			return res.send({
				error: 'Invalid email or password'
			});
		}
		req.logIn(user, function(err) {
			if (err || !user) {
				return res.send({
					error: 'Invalid email or password'
				});
			}
			return res.send({
				message: 'success'
			});
		});
	})(req, res);
};

/*
 * POST /api/Logout
 *
 * Log the user out.
 */
exports.logout = function (req, res) {
	req.logout();
	res.redirect('/login');
};

/*
 * POST /api/users
 *
 * Create a user from AccessRequest (with new company)
 * or from a UserInvite (existing company)
 *
 * Query vars:
 * 		name (String): Full name of the user
 * 		email (String): User's email
 * 		password (String): User's password
 * 		avatar (base64): Img for the user's account
 *
 * 		Non-user vars:
 * 		companyName (String): Name of their company
 * 		companyWebsite (String): Website/domain of the company
 * 		companyInviteHash: The AccessRequest ID object from the companies invite
 *
 * 		OR
 *
 * 		userInviteHash: The UserInvite ID
 */
exports.create = function (req, res, next) {
	if (req.body.companyInviteHash) {
		return exports.createFromAccessRequest(req, res, next);
	}
	if (req.body.userInviteHash) {
		return exports.createFromUserInvite(req, res, next);
	}
	return res.send({
		error: 'Cannot create user'
	});
}

/*
 * INTERNAL
 *
 * Create a user and new company. Only available currently
 * to those invited with AccessRequest objects.
 *
 * Query vars:
 * 		name (String): Full name of the user
 * 		email (String): User's email
 * 		password (String): User's password
 * 		avatar (base64): Img for the user's account
 *
 * 		Non-user vars:
 * 		companyName (String): Name of their company
 * 		companyWebsite (String): Website/domain of the company
 * 		companyInviteHash: The AccessRequest ID object from the companies invite
 */
exports.createFromAccessRequest = function (req, res, next) {
	var domain = req.body.companyWebsite,
		company = new Company({
			name: req.body.companyName,
			domain: domain
		}),
		newUser = new User({
			name: req.body.name,
			avatar: req.body.avatar,
			email: req.body.email,
			password: req.body.password,
			isAdmin: true,
			provider: 'local',
			company: company._id
		});

	var sendStandardError = function() {
		return res.send({
			error: "There was an error. Please contact support at access@getvibe.org for help."
		});
	};

	Async.waterfall([
		function(cb) {
			// Check hash first
			AccessRequest.findById(req.body.companyInviteHash, function(err, accessRequest) {
				if (err) return cb(err);
				if (!accessRequest || !accessRequest.invited) {
					return cb("Your invite is invalid. Please contact support at access@getvibe.org for help.");
				}
				accessRequest.registered = true;
				accessRequest.save(function(err) {
					if (err) return cb(err);
					return cb(null);
				});
			});
		},
		function(cb) {
			User.findOne({
				email: newUser.email
			},function(err, user){
				if (err) return sendStandardError();
				if (user) {
					return cb("Email already registered.");
				}
				return cb(null);
			});
		},
		// try to create the company
		function(cb) {
			Company.findOne({ domain: domain }, function(err, company){
				if (err) return sendStandardError();
				if (company) {
					return cb("Your company has already been created. Please contact support at access@getvibe.org for help.");
				}
				return cb(null);
			});
		},
		// create the company
		function(cb) {
			company.save(function(err){
				if (err) return sendStandardError();
				return cb(null, company);
			});
		},
		// save user
		function(company, cb) {
			newUser.save(function(err){
				if (err) return sendStandardError();
				email.send({
					to: newUser.email,
					subject: 'An intro to Vibe',
					templateName: 'admin_welcome',
					templateData: {
						company_name: company.name,
						name: newUser.name
					}
				});
				return cb(null, company, newUser);
			});
		}], function(err, company, user) {
			if (err) return sendStandardError();

			req.logIn(user, function(err) {
				if (err) return sendStandardError();
				return res.send(user.stripInfo());
			});
		});
}

/*
 * INTERNAL
 *
 * Create a user from an invite and assign them
 * to the company.
 *
 * Query vars:
 * 		name (String): Full name of the user
 * 		email (String): User's email
 * 		password (String): User's password
 * 		avatar (base64): Img for the user's account
 *
 * 		Non-user vars:
 * 		userInviteHash: The UserInvite ID
 */
exports.createFromUserInvite = function(req, res, next) {
	var sendStandardError = function() {
		return res.send({
			error: "There was an error. Please contact support at access@getvibe.org for help."
		});
	};

	Async.waterfall([function(cb) {
		// Load & Validate Invite
		UserInvite.findById(req.body.userInviteHash, function(err, userInvite) {
			if (err) return sendStandardError();
			if (!userInvite) {
				return cb("Your invite code is invalid. Email access@getvibe.org for help.");
			}
			cb(null, userInvite);
		});
	}, function(userInvite, cb) {
		// Load company
		Company.findById(userInvite.company, function(err, company) {
			if (err) return sendStandardError();
			if (!company) {
				return cb("Company for the given invite not found.");
			}
			cb(null, userInvite, company);
		});
	}, function(userInvite, company, cb) {
		User.findOne({
			email: req.body.email
		}, function(err, user){
			if (err) return sendStandardError();
			if (user) {
				return cb("Email already registered.");
			}
			return cb(null, userInvite, company);
		});
	}, function(userInvite, company, cb) {
		// Create User
		User.create({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			avatar: req.body.avatar,
			company: company._id,
			provider: 'local'
		}, function(err, user) {
			if (err) return sendStandardError();
			if (!user) {
				return cb("User could not be created");
			}
			email.send({
				to: user.email,
				subject: 'An intro to Vibe',
				templateName: 'user_welcome',
				templateData: {
					company_name: company.name,
					name: user.name
				}
			});
			cb(null, userInvite, user);
		});
	}, function(userInvite, user, cb) {
		userInvite.registered = true;
		userInvite.save(function(err, userInvite) {
			if (err) return sendStandardError();
			cb(null, user);
		});
	}], function(err, user) {
		if (err) return sendStandardError();

		req.logIn(user, function(err) {
			if (err) return sendStandardError();
			return res.send(user.stripInfo());
		});
	});
};

/*
 * GET /api/users
 *
 * Get current user
 */
exports.get = function(req, res, next){
	return res.send(req.user.stripInfo());
};

/*
 * PUT /api/users
 *
 * Edit the user specified
 *
 * Query vars:
 */
exports.update = function(req, res, next){
	var user = req.user;
	var body = req.body;

	if (body.tutorial) user.tutorial = JSON.stringify(body.tutorial);
	if (body.name) user.name = body.name;
	if (body.password) user.password = body.password;
	if (body.avatar) user.avatar = body.avatar;

	req.user.save(function(err, user){
		if(err) return next(err);

		return res.send(user.stripInfo());
	});
};

/*
 * POST /api/users/invite
 *
 * Bulk invite users based on their email.
 * Used in part 3 of the admin registration process.
 *
 * Query vars:
 * 		users (Array of):
 * 			email (String) email of the users
 * 			isAdmin (Boolean) admin status
 */
exports.batchInvite = function(req, res) {
	var users = req.body.users,
		userInvite;

	if (!_.isArray(users) || !users.length) {
		return helpers.sendError(res, "Input incorrectly formatted");
	}

	for (var i = 0; i < users.length; i++) {
		if (!helpers.isValidEmail(users[i].email)) {
			return helpers.sendError(res, "This email doesn't work: " + users[i].email);
		}
	}

	Company.findById(req.user.company, function(err, company) {
		for (i = 0; i < users.length; i++) {
			UserInvite.create({
				inviter: req.user._id,
				company: req.user.company,
				invitee: {
					email: users[i].email,
					isAdmin: users[i].isAdmin
				}
			}, function(err, userInvite) {
				if (userInvite) {
					email.send({
						to: userInvite.invitee.email,
						subject: req.user.name + ' invited you to join '+company.name+'\'s Vibe!',
						templateName: 'invite_user',
						templateData: {
							inviter_name: req.user.name,
							company_name: company.name,
							uniqueHash: userInvite._id.toString(),
							email: userInvite.invitee.email
						}
					});
				}
			});
		}
	});

	res.send({
		status: 'success'
	});
};

/*
 * POST /api/users/:email/forgot_password
 *
 * Called on the forgot password page. User inputs
 * their email and we start the forgot password
 * process by sending them an email, which directs
 * to the rest password flow.
 *
 * Query vars:
 * 		email (String)
 */
exports.forgot_password = function(req, res) {
	// Check if valid email
	if (!helpers.isValidEmail(req.body.email)) {
		return res.send({
			error: 'That email doesn\'t work'
		});
	}

	User.findOne({
		email: req.body.email
	}, function(err, user) {
		// Check if user exists
		if (err || !user) {
			return res.send({
				error: 'No account with that email found'
			});
		}

		// Generate unique token for password reset
		var uniqueHash = crypto.randomBytes(20).toString('hex');

		// Store hash as part of user object
		user.reset_password_hash = uniqueHash;
		user.save();

		email.send({
			to: req.body.email,
			subject: 'Vibe - Request to reset your password',
			templateName: 'reset_password',
			templateData: {
				uniqueHash: uniqueHash,
				userEmail: req.body.email
			}
		});

		res.send({ message: 'success' });
	});
};

/*
 * POST /api/users/:email/reset_password
 *
 * Called on the reset password page, which users
 * get to by following a link in an email sent.
 * Uses a private, user-unique hash for security.
 *
 * Query vars:
 * 		email (String)
 * 		password (String)
 * 		hash (String)
 */
exports.reset_password = function(req, res) {
	// Check if valid email
	if (!helpers.isValidEmail(req.body.email)) {
		return res.send({
			error: 'That email doesn\'t work'
		});
	}

	User.findOne({
		email: req.body.email
	}, function(err, user) {
		if (user.reset_password_hash !== req.body.hash) {
			return res.send({
				error: 'We cannot change your password at this time. Please go to the <a href="/forgot_password">forgot password page</a> to try again.'
			});
		}

		user.password = req.body.password;
		user.reset_password_hash = '';
		user.save(function(err) {
			if (err && _.keys(err.errors).length) {
				return res.send({
					error: err.errors[_.keys(err.errors)[0]].message
				});
			}

			return res.send(200, {
				message: 'success'
			});
		});
	});
};

// Cache the app and passport
module.exports = function(exportedApp, exportedPassport) {
	if (exportedApp) app = exportedApp;
	if (exportedPassport) passport = exportedPassport;
	return exports;
};
