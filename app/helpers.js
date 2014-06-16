var helpers = {};

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

exports = module.exports = helpers;

