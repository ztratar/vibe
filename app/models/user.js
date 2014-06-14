/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , bcrypt = require('bcrypt')
  , crypto = require('crypto')
  , _ = require('underscore')
  , helpers = require('../helpers')
  , authTypes = ['github', 'twitter', 'facebook', 'google']

/**
 * User Schema
 */

var UserSchema = new Schema({
  name: String,
  email: { type: String, lowercase: true, trim: true },
  avatar: { type: String, default: '' },

  isAdmin: { type: Boolean, default: false },
  isSuperAdmin: { type: Boolean, default: false },

  company: { type: Schema.Types.ObjectId, ref: 'Company' },
  provider: String,
  active: { type: Boolean, default: true },

  salt: String,
  hashed_password: String,
  facebook: {},
  twitter: {},
  github: {},
  google: {},

  tutorial: { type: String, default: "{}" },
  reset_password_hash: String
})

/**
 * Virtuals
 */

UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function() { return this._password })

/**
 * Validations
 */
var validatePresenceOf = function (value) {
  return value && value.length
}

UserSchema.path('name').validate(function (name) {
  return name.length
}, 'Name cannot be blank')

UserSchema.path('email').validate(function (email) {
  return email.length
}, 'Email cannot be blank')

UserSchema.path('email').validate(function (email) {
  return helpers.isValidEmail(email);
}, 'That email doesnt work');

UserSchema.path('hashed_password').validate(function (hashed_password) {
	if (this._password) {
		if (typeof this._password !== 'string' || this._password.length < 8) {
			this.invalidate('password', 'Password must be at least 8 characters long');
		} else if (this._password.length > 30) {
			this.invalidate('password', 'Password must be less than 30 characters long');
		}
	}
	return hashed_password.length
}, 'Password cannot be blank')

/**
 * Pre-save hook
 */
UserSchema.pre('save', function(next) {
  if (!this.isNew) return next()

  if (!validatePresenceOf(this.password)
    && authTypes.indexOf(this.provider) === -1)
    next(new Error('Invalid password'))
  else
    next()
})

/**
 * Methods
 */

UserSchema.methods = {

  stripInfo: function() {
    var user = this.toObject();
    user.hashed_password = undefined;
    user.salt = undefined;
    user.provider = undefined;

    return user;
  },

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */

  authenticate: function(plainText) {
	return bcrypt.compareSync(plainText, this.hashed_password);
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

  makeSalt: function() {
    return bcrypt.genSaltSync(10);
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */

  encryptPassword: function(password) {
    if (!password) return ''
    return bcrypt.hashSync(password, this.salt);
  }

}

mongoose.model('User', UserSchema)
