// Module dependencies.
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('underscore');

// Chat Schema
var ChatSchema = new Schema({
	creator: {
		ref: { type: Schema.Types.ObjectId, ref: 'User' },
		name: { type: String, required: true },
		avatar: { type: String, required: true }
	},
	question: {
		type: Schema.Types.ObjectId,
		ref: 'Question',
		index: true
	},
	feedback: {
		type: Schema.Types.ObjectId,
		ref: 'Feedback',
		index: true
	},
	body: { type: String },
	time_created: { type: Date, default: Date.now },
	votes: { type: Array, default: [] },
	num_votes: { type: Number, default: 0 }
});

ChatSchema.path('body').validate(function(body) {
	return body && body.length;
}, 'You need to say something');

ChatSchema.methods = {

	stripInfo: function() {
		var chat = this.toObject();

		chat.votes = undefined;

		return chat;
	}

};

mongoose.model('Chat', ChatSchema);
