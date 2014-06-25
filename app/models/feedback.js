// Module dependencies.
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('underscore');

// Feedback Schema
var FeedbackSchema = new Schema({
	time_created: { type: Date, default: Date.now },
	status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending'},
	status_change_reason: { type: String },
	status_changed_by: { type: Schema.Types.ObjectId, ref: 'User' },
	time_status_changed: { type: Date },
	creator: { type: Schema.Types.ObjectId, ref: 'User' },
	company: { type: Schema.Types.ObjectId, ref: 'Company' },
	body: { type: String },
	votes: { type: Array, default: [] },
	chats_last_seen: { type: Schema.Types.Mixed, default: {} },
	// chats_last_seen stores '<user_id>' -> 'num_votes when chat opened'
	num_chats: { type: Number, default: 0 },
	num_votes: { type: Number, default: 0 },
	users_chatted: { type: [Schema.Types.ObjectId], ref: 'User', default: [] },
	users_chatting: { type: [Schema.Types.ObjectId], ref: 'User', default: [] }
});

// Validations
FeedbackSchema.path('body').validate(function(body) {
	return body && body.length;
}, 'Feedback can\'t be blank');

FeedbackSchema.path('body').validate(function(body) {
	return body.length <= 200;
}, 'That\'s too long');

// Methods
FeedbackSchema.methods = {

	stripInfo: function(currentUser) {
		var feedback = this.toObject();

		if (currentUser
				&& this.didUserVote(currentUser._id)) {
			feedback.current_user_agreed = true;
		} else {
			feedback.current_user_agreed = false;
		}

		feedback.votes = undefined;
		feedback.creator = undefined;
		feedback.status_changed_by = undefined;
		feedback.time_created = undefined;
		feedback.time_status_changed = undefined;
		feedback.company = undefined;

		return feedback;
	},

	didUserVote: function(userId) {
		return _.contains(_.map(this.votes, function(vote) {
			return vote.toString();
		}), userId.toString());
	},

	markChatEntered: function(req) {
		var fbQueryObj = {
			$set: {},
			$push: {
				users_chatting: req.user._id
			}
		};
		fbQueryObj.$set['chats_last_seen.' + req.user._id] = this.num_chats;
		this.update(fbQueryObj, function(err, numAffected, test) {});
	},

	leaveChat: function(req) {
		var that = this;

		this.update({ $pull: { 'users_chatting': req.user._id } }, function(err, numAffected) {});
	},

	incrementUnreadCountsAndMarkParticipation: function(req) {
		var updateObj = {
				$addToSet: {
					users_chatted: req.user._id
				},
				$inc: {}
			},
			currentLastSeen = this.chats_last_seen,
			currentChatting = _.map(this.users_chatting, function(userId) {
				return userId.toString();
			});

		_.each(currentChatting, function(user) {
			updateObj.$inc['chats_last_seen.' + user] = 1;
		});
		updateObj.$inc.num_chats = 1;

		this.update(updateObj, function(err, numAffected) {});
	}

}

mongoose.model('Feedback', FeedbackSchema);

