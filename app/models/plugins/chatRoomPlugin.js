var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('underscore');

var ChatRoomPlugin = function(schema, options) {
	schema.add({
		chat: {
			chats_last_seen: { type: Schema.Types.Mixed, default: {} },
			num_chats: { type: Number, default: 0 },
			users_participating: { type: [Schema.Types.ObjectId], ref: 'User', default: [] },
			users_chatting: { type: [Schema.Types.ObjectId], ref: 'User', default: [] }
		}
	});

	_.extend(schema.methods, {

		markChatEntered: function(req) {
			var fbQueryObj = {
				$set: {},
				$push: {
					'chat.users_chatting': req.user._id
				}
			};
			fbQueryObj.$set['chat.chats_last_seen.' + req.user._id] = this.chat.num_chats;
			this.update(fbQueryObj, function(err, numAffected, test) {});
		},

		leaveChat: function(req) {
			var that = this;

			this.update({
				$pull: {
					'chat.users_chatting': req.user._id
				}
			}, function(err, numAffected) {});
		},

		incrementUnreadCountsAndMarkParticipation: function(req) {
			var updateObj = {
					$addToSet: {
						'chat.users_participating': req.user._id
					},
					$inc: {}
				},
				currentLastSeen = this.chat.chats_last_seen,
				currentChatting = _.map(this.chat.users_chatting, function(userId) {
					return userId.toString();
				});

			_.each(currentChatting, function(user) {
				updateObj.$inc['chat.chats_last_seen.' + user] = 1;
			});
			updateObj.$inc['chat.num_chats'] = 1;

			console.log(updateObj);
			this.update(updateObj, function(err, numAffected) {
				console.log('test', err, numAffected);
			});
		}

	});
};

exports = module.exports = ChatRoomPlugin;
