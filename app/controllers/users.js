// Module dependencies.
var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Company = mongoose.model('Company'),
	Async = require('async'),
	crypto = require('crypto'),
	email = require('./email'),
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
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: 'Invalid email or password.'
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
	var findQuery;

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
		if (err || !user.length) {
			console.log('finding', err, user);
			res.send({
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
				uniqueHash: uniqueHash
			}
		});

		res.send(200, { message: 'success' });
	});
};

/*
 * POST /api/users
 *
 * Create a user and new company.
 *
 * Query vars:
 * 		name (String): Full name of the user
 * 		email (String): User's email
 * 		password (String): User's password
 * 		companyName (String): Name of their company
 *  	companyWebsite (String): Website of the company
 */
exports.create = function (req, res) {
	var domain = req.body.companyWebsite,
		company = new Company({
			name: req.body.companyName,
			domain: domain
		}),
		newUser = new User({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			isAdmin: true,
			provider: 'local',
			company: company._id
		});

	Async.waterfall([
		function(cb) {
			User.findOne({email: newUser.email},function(err, user){
				if(err) return cb(err);
				if(user){
					return res.render('users/signup', { errors: [{"message":"email already registered"}], user:newUser });
				}
				return cb(null);
			});
		},
		// try to create the company
		function(cb) {
			Company.findOne({domain: domain}, function(err, company){
				if(err) return cb(err);
				if(company){
					return res.render('users/signup', { errors: [{"message":"Company already exists"}], user:newUser });
				}
				return cb(null);
			});
		},
		// create the company
		function(cb) {
			company.save(function(err){
				if (err) { console.log(err); return res.render('users/signup', { errors: err.errors, user:newUser }); } 
				return cb(null, company);
			});
		},
		// save user
		function(company, cb) {
			newUser.save(function(err){
				if (err) { console.log(err); return res.render('users/signup', { errors: err.errors, user:newUser }); } 
				return cb(null, company, newUser);
			});
		}], function(err, company, user) {
			if(err){
				console.error("splat");
				console.error(err.stack);
				return res.send(500, {error: "splat"});
			}
			//log the user in
			req.logIn(user, function(err) {
				if (err){
					console.error(err.stack);
					return res.send(500, {error: "splat"});
				}
				return res.redirect('/');
			});
		});
}

/*
 * GET /api/users
 *
 * Get current user
 */
exports.get = function(req, res, next){
	return res.send(req.user.stripInfo());
}

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

	req.user.save(function(err, user){
		if(err) return next(err);

		return res.send(user.stripInfo());
	});
};

// Cache the app and passport
module.exports = function(exportedApp, exportedPassport) {
	app = exportedApp;
	passport = exportedPassport;
	return exports;
};
