// Module dependencies.

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('underscore'),
	helpers = require('../helpers');

// UserInvite Schema
var UserInviteSchema = new Schema({
	inviter: { type: Schema.Types.ObjectId, ref: 'User' },
	company: { type: Schema.Types.ObjectId, ref: 'Company' },
	invitee: {
		email: { type: String, lowercase: true, trim: true },
		isAdmin: { type: Boolean, default: false }
	},
	registered: { type: Boolean, default: false },
	timeCreated: { type: Date, default: Date.now() }
});

// Validations
UserInviteSchema.path('invitee.email').validate(function (email) {
  return email && email.length;
}, 'Email cannot be blank');

UserInviteSchema.path('invitee.email').validate(function (email) {
  return helpers.isValidEmail(email);
}, 'That email doesnt work');

mongoose.model('UserInvite', UserInviteSchema);
