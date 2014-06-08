/*
 * STATIC PAGE LOAD - Index & Splash
 */
exports.index = function(req, res) {
	if (req.isAuthenticated()) {
		res.render('home/index', {
			currentUser: req.user
		});
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
exports.register = function (req, res) {
	if (req.isAuthenticated()) res.redirect('/');
	res.render('users/register');
};

/*
 * STATIC PAGE LOAD - User Registration Page
 */
exports.registerFromInvite = function (req, res) {
	if (req.isAuthenticated()) res.redirect('/');

	var company_name = /company_name=([^&]+)/.exec(req._parsedUrl.query);

	if (company_name && company_name.length) {
		company_name = company_name[1].replace('+', ' ');
	} else {
		return res.redirect('/');
	}

	res.render('users/registerFromInvite', {
		company_name: company_name
	});
};

/*
 * STATIC PAGE LOAD - Forgot Password Page
 */
exports.forgot_password = function(req, res) {
	if (req.isAuthenticated()) res.redirect('/');
	res.render('users/forgot_password');
};

/*
 * STATIC PAGE LOAD - Reset Password Page
 */
exports.reset_password = function(req, res) {
	if (req.isAuthenticated()) res.redirect('/');
	res.render('users/reset_password');
};

/*
 * STATIC PAGE LOAD - Forgot Password Page
 */
exports.admin_invite_company = function(req, res) {
	if (req.isAuthenticated() && req.user.isSuperAdmin) {
		res.render('admin/invite_company');
	} else {
		res.redirect('/');
	}
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
