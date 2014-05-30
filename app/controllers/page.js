/*
 * STATIC PAGE LOAD - Index & Splash
 */
exports.index = function(req, res) {
	if (req.isAuthenticated()) {
		res.render('home/index');
	} else {
		res.render('splash/index');
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
			message: req.flash('error')
		});
	}
};

/*
 * STATIC PAGE LOAD - Company/Admin Registration Page
 */
exports.signup = function (req, res) {
	res.render('users/signup', {
		title: 'Sign up',
		user: new User()
	});
};

/*
 * STATIC PAGE LOAD - Forgot Password Page
 */
exports.forgot_password = function(req, res) {
	res.render('users/forgot_password');
};

/*
 * STATIC PAGE LOAD - Forgot Password Page
 */
exports.reset_password = function(req, res) {
	res.render('users/reset_password');
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
