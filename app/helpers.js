var helpers = {};

helpers.isValidEmail = function(email) {
	var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	return emailRegex.test(email);
};

// Takes in either an error string or mongoose error object
// and returns the error to the API endpoint
helpers.sendError = function(res, error) {
	if (typeof error === 'string') {
		return res.send({
			error: error
		});
	} else {
		if (error.errors) {
			for (var errorField in error.errors) {
				return res.send({
					error: error.errors[errorField]
				});
			}
		} else {
			return res.send({
				error: 'An error occured'
			});
		}
	}
};

exports = module.exports = helpers;

