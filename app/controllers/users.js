// Module dependencies.
var mongoose = require('mongoose'),
	env = process.env.NODE_ENV || 'development',
	_ = require('underscore'),
	User = mongoose.model('User'),
	Chat = mongoose.model('Chat'),
	Company = mongoose.model('Company'),
	Post = mongoose.model('Post'),
	AccessRequest = mongoose.model('AccessRequest'),
	UserInvite = mongoose.model('UserInvite'),
	Async = require('async'),
	crypto = require('crypto'),
	email = require('./email')(),
	pushController = require('./push'),
	helpers = require('../helpers'),
	twilio = require('twilio'),
	app,
	passport;

var twilioClient = new twilio.RestClient('ACecea4c8ecb6fddd7efe2d730b61ea188', 'a6aa3583ace3e2292bf5939fc897c9ff'),
	twilioSendPersonalMessage = function(message) {
		if (env !== 'development') {
			twilioClient.sms.messages.create({
				to: '+16308548826',
				from: '+13312155958',
				body: message
			});
		}
	};

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
				error: 'Wrong email or password'
			});
		}

		if (user.active === false) {
			return res.send({
				error: 'This account has been disabled'
			});
		}

		req.logIn(user, function(err) {
			if (err || !user) {
				return res.send({
					error: 'Wrong email or password'
				});
			}

			if (!user.isSuperAdmin) {
				twilioSendPersonalMessage(req.body.email + ' logged onto Vibe');
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
 * 		companyLogo (String): base64 encoded png
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
			domain: domain,
			logo: req.body.companyLogo || ''
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
			error: "There was an error. Please contact support at access@getvibe.com for help."
		});
	};

	Async.waterfall([
		function(cb) {
			// Check hash first
			AccessRequest.findById(req.body.companyInviteHash, function(err, accessRequest) {
				if (err) return cb(err);
				if (!accessRequest || !accessRequest.invited) {
					return cb("Your invite is invalid. Please contact support at access@getvibe.com for help.");
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
					return cb("Your company has already been created. Please contact support at access@getvibe.com for help.");
				}
				return cb(null);
			});
		},
		// create the company
		function(cb) {
			company.save(function(err){
				if (err) return sendStandardError();

				if (req.body.companyLogo) {
					company.convertField('logo');
				}

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

			twilioSendPersonalMessage(user.email + ' created an account from Access');

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
			error: "There was an error. Please contact support at access@getvibe.com for help."
		});
	};

	Async.waterfall([function(cb) {
		// Load & Validate Invite
		UserInvite.findById(req.body.userInviteHash, function(err, userInvite) {
			if (err) return helpers.sendError(res, err);
			if (err) return sendStandardError();
			if (!userInvite) {
				return cb("Your invite code is invalid. Email access@getvibe.com for help.");
			}
			cb(null, userInvite);
		});
	}, function(userInvite, cb) {
		// Load company
		Company.findById(userInvite.company, function(err, company) {
			if (err) return helpers.sendError(res, err);
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
			if (err) return helpers.sendError(res, err);
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
			if (err) return helpers.sendError(res, err);
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
	}, function(user, cb) {
		user.generateNewUserPostsFeed(function(err, posts) {
			cb(null, user);
		});
		user.convertAvatar();
	}], function(err, user) {
		if (err) return sendStandardError();

		twilioSendPersonalMessage(user.email + ' created an account from Invite');

		req.logIn(user, function(err) {
			if (err) return sendStandardError();
			res.send(user.stripInfo());
		});
	});
};

/*
 * GET /api/users
 *
 * Get all users in your company
 */
exports.get = function(req, res, next){
	User.find({
		company: req.user.company,
		active: true
	}, function(err, users) {
		if (err) return helpers.sendError(res, "Couldn't find any users");
		if (!users) return res.send([]);

		res.send(_.map(users, function(user) {
			return user.stripInfo();
		}));
	});
};

/*
 * GET /api/admin/users
 *
 * Get all users in the entire system. Requires super admin
 */
exports.getAllUsers = function(req, res, next){
	User.find({}, function(err, users) {
		if (err) return helpers.sendError(res, "Couldn't find any users");
		if (!users) return res.send([]);

		res.send(_.map(users, function(user) {
			return user.stripInfo();
		}));
	});
};

/*
 * GET /api/users/me
 *
 * Get the current user
 */
exports.getCurrentUser = function(req, res, next){
	if (!req.user) {
		return helpers.sendError(res, "You're not logged in");
	} else {
		res.send(req.user.stripInfo());
	}
};


/*
 * GET /api/users/pending
 *
 * Get pending invites sent from admins. This
 * is shown on the settings manage team page.
 */
exports.getPending = function(req, res) {
	if (!req.user.isAdmin) {
		return helpers.sendError(res, "Only admins can do this");
	}

	UserInvite.find({
		company: req.user.company,
		registered: false
	}, function(err, userInvites) {
		if (err) return helpers.sendError(res, "Couldn't find invites");
		if (!userInvites.length) res.send([]);

		res.send(_.map(userInvites, function(userInvite) {
			return userInvite.asUser()
		}));
	});
};

/*
 * GET /api/users/admins
 *
 * Get the company admins
 */
exports.getAdmins = function(req, res, cb) {
	User.find({
		company: req.user.company._id,
		isAdmin: true
	}, function(err, admins) {
		var mappedUsers = _.map(admins, function(admin) {
			return admin.stripInfo();
		});
		if (!res) {
			return cb(null, mappedUsers);
		} else {
			res.send(mappedUsers);
		}
	});
};

/*
 * GET /api/admin/users/:user/regenerate_feed
 *
 * Re-created the users feed
 */
exports.regenerateFeed = function(req, res, cb) {
	var userId = req.params.user;
	if (userId === 'me') {
		userId = req.user._id;
	}

	User.findById(userId, function(err, user) {
		if (err || !user) res.send(500);
		Post.update({
			for_user: user._id
		}, {
			$set: {
				active: false
			}
		}, function(err, numAffected) {
			user.generateNewUserPostsFeed(function() {
				res.send({ message: 'New feed created' });
			});
		});
	});
};

/*
 * GET /api/admin/users/:user/refresh_chat_avatars
 *
 * Update denormalized avatar
 */
exports.refreshChatAvatars = function(req, res) {
	var userId = req.params.user;
	if (userId === 'me') {
		userId = req.user._id;
	}

	User.findById(userId, function(err, user) {
		if (err || !user) res.send(500);
		Chat.update({
			'creator.ref': user._id
		}, {
			$set: {
				'creator.avatar': user.avatar
			}
		}, {
			multi: true
		}, function(err, numAffected) {
			res.send({ message: 'Avatars updated' });
		});
	});
};

/*
 * PUT /api/users
 *
 * Edit the user specified
 *
 * Query vars:
 */
exports.update = function(req, res, next){
	if (!req.params.id) {
		return res.send({ error: 'No id specified' });
	}

	Async.waterfall([function(cb) {
		if (req.params.id !== req.user._id.toString()) {
			// Editing other user... check to see if permissions are good
			User.findById(req.params.id, function(err, user) {
				if (user.company.toString() === req.user.company._id.toString() && req.user.isAdmin) {
					cb(null, user);
				} else {
					return cb("You don't have permission to do this");
				}
			});
		} else {
			cb(null, req.user);
		}
	}], function(err, user) {
		if (err) return helpers.sendError(res, err);

		var body = req.body;

		console.log('saving user', body);

		var changedAvatar = false;

		if (body.name) user.name = body.name;
		if (body.avatar && user.avatar !== body.avatar) {
			changedAvatar = true;
			user.avatar = body.avatar;
		}
		if (body.isAdmin !== undefined) user.isAdmin = body.isAdmin;
		if (body.email && body.email !== user.email) user.startChangeEmail(body.email);
		if (body.tutorial) user.tutorial = body.tutorial;
		if (body.device_type) user.device_type = body.device_type;
		if (body.device_token && user._id.toString() === req.user._id.toString()) {
			user.device_token = body.device_token;

			twilioSendPersonalMessage(user.email + ' registered a ' + user.device_type + ' device');

			if (user.device_type === 'ios') {
				console.log('in device type', user.device_token);
				pushController.insertOrUpdateInstallationDataWithChannels(
					'ios',
					user.device_token,
					[
						'user-' + user._id.toString(),
						'company-' + user.company._id.toString()
					],
					function() {}
				);
			}
		}

		// Ensure current user for password changes
		if (body.password && user._id.toString() === req.user._id.toString()) {
			// confirm old password
			if (user.authenticate(body.password_current)) {
				// Cool - change the password
				user.password = body.password;
			} else {
				return res.send({ error: "Invalid current password" });
			}
		}

		user.save(function(err, user){
			console.log('attempted to save user', err, user);
			if (err) return helpers.sendError(res, err);
			res.send(user.stripInfo());

			if (changedAvatar) user.convertAvatar();
		});
	});
};

/*
 * POST /api/userinvites/batch_invite
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

	if (!req.user.isAdmin) {
		return helpers.sendError(res, "Only admins can do this");
	}

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
			exports.inviteUser(req, res, company, {
				email: users[i].email,
				isAdmin: users[i].isAdmin
			});
		}
	});

	res.send({
		status: 'success'
	});
};

/*
 * POST /api/userinvites
 *
 * Invite a single user via an email, return
 * as user object
 *
 * Query vars:
 *  	email (String): email of user to invite
 */
exports.invite = function(req, res) {
	if (!req.user.isAdmin) {
		return helpers.sendError(res, "Only admins can do this");
	}

	if (!helpers.isValidEmail(req.body.email)) {
		return helpers.sendError(res, "That email doesn't work");
	}

	Company.findById(req.user.company, function(err, company) {
		exports.inviteUser(req, res, company, {
			email: req.body.email,
			isAdmin: req.body.isAdmin
		}, true);
	});
};

/*
 * INTERNAL
 *
 * Invite this user to the company
 */
exports.inviteUser = function(req, res, company, userToInvite, returnResponse) {
	UserInvite.create({
		inviter: req.user._id,
		company: req.user.company,
		invitee: {
			email: userToInvite.email,
			isAdmin: userToInvite.isAdmin
		}
	}, function(err, userInvite) {
		if (err) return;

		if (userInvite) {
			email.send({
				to: userInvite.invitee.email,
				subject: req.user.name + ' invited you to join ' + company.name + '\'s Vibe!',
				templateName: 'invite_user',
				templateData: {
					inviter_name: req.user.name,
					company_name: company.name,
					uniqueHash: userInvite._id.toString(),
					email: userInvite.invitee.email
				}
			});

			if (returnResponse) {
				res.send(userInvite.asUser());
			}
		}
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
			if (err) return helpers.sendError(res, err);

			return res.send(200, {
				message: 'success'
			});
		});
	});
};

/*
 * DELETE /api/users/:id
 *
 * Delete the current user from the company
 * by marking as inactve.
 */
exports.delete = function(req, res) {
	User.findById(req.params.id, function(err, user) {
		if (err) return helpers.sendError(res, err);
		if (!user) return helpers.sendError(res, "No user found");

		user.active = false;
		user.save();

		res.send(200);
	});
};

/*
 * DELETE /api/userinvites/:id
 *
 * Invalidates an invite previous sent by deleting
 * the invite object
 *
 */
exports.uninvite = function(req, res) {
	UserInvite.findById(req.params.id, function(err, userInvite) {
		if (err) return helpers.sendError(res, err);
		if (!userInvite) return helpers.sendError(res, "No invite found");

		userInvite.remove();

		res.send(200);
	});
};

// Cache the app and passport
module.exports = function(exportedApp, exportedPassport) {
	if (exportedApp) app = exportedApp;
	if (exportedPassport) passport = exportedPassport;
	return exports;
};
