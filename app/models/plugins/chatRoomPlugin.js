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

		markChatEntered: function(user) {
			var fbQueryObj = {
				$set: {},
				$push: {
					'chat.users_chatting': user._id
				}
			};
			fbQueryObj.$set['chat.chats_last_seen.' + user._id] = this.chat.num_chats;
			this.update(fbQueryObj, function(err, numAffected, test) {});
		},

		leaveChat: function(user) {
			var that = this;

			this.update({
				$pull: {
					'chat.users_chatting': user._id
				}
			}, function(err, numAffected) {});
		},

		incrementUnreadCountsAndMarkParticipation: function(user) {
			var updateObj = {
					$addToSet: {
						'chat.users_participating': user._id
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

			this.update(updateObj, function(err, numAffected) {});
		}

	});
};

exports = module.exports = ChatRoomPlugin;
