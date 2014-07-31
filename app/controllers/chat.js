// Module dependencies.
var mongoose = require('mongoose'),
	_ = require('underscore'),
	Chat = mongoose.model('Chat'),
	app;

/*
 * DELETE /api/chats/:chat
 *
 * Deletes the given chat
 */
exports.delete = function(req, res, next) {
	Chat.findById(req.params.id, function(err, chat) {
		if (err) return helpers.sendError(res, err);
		if (!chat) return helpers.sendError(res, 'No chat found');

		chat.remove(function() {
			res.send(200);
		});
	});
};

// Cache app object upon first call
module.exports = function(exportedApp) {
	if (exportedApp) app = exportedApp;
	return exports;
};
