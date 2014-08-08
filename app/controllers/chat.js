// Module dependencies.
var mongoose = require('mongoose'),
	_ = require('underscore'),
	Feedback = mongoose.model('Feedback'),
	Question = mongoose.model('Question'),
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

		if (!(req.user.isAdmin || chat.creator.ref.toString() === req.user._id.toString())) {
			return helpers.sendError(res, 'You don\'t have permission to do this');
		}

		var UpdateModel,
			updateField;
		if (chat.feedback) {
			UpdateModel = Feedback;
			updateField = 'feedback';
		} else if (chat.question) {
			UpdateModel = Question;
			updateField = 'question';
		}

		UpdateModel.update({
			_id: chat[updateField]
		}, {
			$inc: {
				'chat.num_chats': -1
			}
		}, function() {});

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
