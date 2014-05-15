
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Async = require('async')
  , AccessRequest = mongoose.model('AccessRequest');


/**
* POST /access/request
* User requests beta access
* query strings:
*   company_name
*   email
*/
exports.request = function(req, res, next){
  var findQuery = AccessRequest.find({
	  email: req.body.email
  });

  findQuery.exec(function(err, accessRequest){
    if (err) return next(err)

	if (accessRequest.length) {
		return res.send({
			status: 'already_requested',
			request: accessRequest[0]
		});
	} else {
		accessRequest = new AccessRequest({
			email: req.body.email,
			company_name: req.body.company_name
		});
		accessRequest.save(function(err, model) {
			if (err) return next(err);

			return res.send({
				status: 'success',
				request: model
			});
		});
	}
  });
};
