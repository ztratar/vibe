var env = process.env.NODE_ENV || 'development',
	config = require('../../config/config')[env],
	async = require('async'),
	users = require('./users')();

/*
 * STATIC PAGE LOAD - Index & Splash
 */
exports.index = function(req, res) {
	if (req.isAuthenticated()) {

		console.log('-> Loading index page...');

		if (req.user.active === false) {
			// In case you tried to go in as an inactie
			req.session.fakeUser = false;
			req.session.fakeCompany = false;
			req.session.save();

			req.logout();
			return res.redirect('/login');
		}

		async.parallel([
			function(cb) {
				users.getAdmins(req, null, function(err, admins) {
					if (err) return cb(err);
					cb(null, admins)
				});
			}
		], function(err, results) {
			res.render('home/index', {
				env: process.env.NODE_ENV || 'development',
				config: config,
				currentUser: req.user,
				sessionID: req.sessionID,
				data: {
					admins: results[0]
				}
			});
		});
	} else {
		console.log('-> Loading splash page...');
		res.render('splash/index', {
			env: process.env.NODE_ENV || 'development',
			config: config
		});
	}
};

/*
 * STATIC PAGE LOAD - Login Page
 */
exports.login = function (req, res) {
	if (req.isAuthenticated()) {
		res.redirect('/');
	} else {
		res.render('users/login', {
			title: 'Login',
			env: process.env.NODE_ENV || 'development',
			config: config
		});
	}
};

/*
 * STATIC PAGE LOAD - Company/Admin Registration Page
 */
exports.register = function (req, res) {
	if (req.isAuthenticated()) res.redirect('/');

	console.log('-> Loading register page...');

	res.render('users/register', {
		env: process.env.NODE_ENV || 'development',
		config: config
	});
};

/*
 * STATIC PAGE LOAD - User Registration Page
 */
exports.registerFromInvite = function (req, res) {
	if (req.isAuthenticated()) res.redirect('/');

	console.log('-> Loading registerFromInvite page...');

	var company_name = /company_name=([^&]+)/.exec(req._parsedUrl.query);

	if (company_name && company_name.length) {
		company_name = company_name[1].replace('+', ' ');
	} else {
		return res.redirect('/');
	}

	res.render('users/registerFromInvite', {
		company_name: company_name,
		env: process.env.NODE_ENV || 'development',
		config: config
	});
};

/*
 * STATIC PAGE LOAD - Forgot Password Page
 */
exports.forgot_password = function(req, res) {
	if (req.isAuthenticated()) res.redirect('/');
	res.render('users/forgot_password', {
		env: process.env.NODE_ENV || 'development',
		config: config
	});
};

/*
 * STATIC PAGE LOAD - Reset Password Page
 */
exports.reset_password = function(req, res) {
	if (req.isAuthenticated()) res.redirect('/');
	res.render('users/reset_password', {
		env: process.env.NODE_ENV || 'development',
		config: config
	});
};

/*
 * STATIC PAGE LOAD - Reset Password Page
 */
exports.change_email = function(req, res) {
	var hash = /hash=([^&]+)/.exec(req._parsedUrl.query);

	if (hash.length) {
		hash = hash[1];
	} else {
		return res.redirect('/');
	}

	if (!req.isAuthenticated()) {
		return res.redirect('/login?changeEmailHash=' + hash);
	}

	if (req.user.pending.hash === hash) {
		req.user.changeEmailTo(req.user.pending.email);
		res.render('users/change_email', {
			env: process.env.NODE_ENV || 'development',
			config: config
		});
	} else {
		res.send('Incorrect email change code provided. Please request a new change and try again.');
	}
};

/*
 * STATIC PAGE LOAD - Admin Invite Company Page
 */
exports.admin_invite_company = function(req, res) {
	//if (req.isAuthenticated() && req.user.isSuperAdmin) {
		res.render('admin/invite_company', {
			env: process.env.NODE_ENV || 'development',
			config: config
		});
	/*} else {
		res.redirect('/');
	}*/
};

/*
 * STATIC PAGE LOAD - Privacy Policy Page
 */
exports.privacy = function(req, res) {
	res.render('splash/privacy');
};

/*
 * STATIC PAGE LOAD - Terms of Use Page
 */
exports.terms = function(req, res) {
	res.render('splash/terms');
};

// Cache app object upon first call
module.exports = function(exportedApp) {
	if (exportedApp) app = exportedApp;
	return exports;
};
