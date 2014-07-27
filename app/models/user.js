/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require('bcrypt'),
	crypto = require('crypto'),
	_ = require('underscore'),
	helpers = require('../helpers'),
	Feedback = mongoose.model('Feedback'),
	Question = mongoose.model('Question'),
	Post = mongoose.model('Post'),
	authTypes = ['github', 'twitter', 'facebook', 'google'],
	env = process.env.NODE_ENV || 'development',
	config = require('../../config/config')[env];

/**
 * User Schema
 */
var UserSchema = new Schema({
	name: String,
	email: {
		type: String,
		lowercase: true,
		trim: true,
		index: true
	},
	avatar_v: { type: Number, default: 0 },
	avatar: { type: String, default: '' },

	pending: {
		changeHash: { type: String },
		email: { type: String }
	},

	device_token: { type: String, default: '' },
	device_type: { type: String, default: '' },

	isAdmin: { type: Boolean, default: false },
	isSuperAdmin: { type: Boolean, default: false },

	company: {
		type: Schema.Types.ObjectId,
		ref: 'Company',
		index: true
	},
	provider: String,
	active: { type: Boolean, default: true },

	salt: String,
	hashed_password: String,
	facebook: {},
	twitter: {},
	github: {},
	google: {},

	tutorial: {
		fte: { type: Boolean, default: false },
		fte_admin: { type: Boolean, default: false }
	},
	reset_password_hash: String,
	emails: {
		receive_unread_notifs: { type: Boolean, default: true }
	},

	time_created: { type: Date, default: Date.now },
	time_updated: { type: Date, default: Date.now }
});

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
	},

	hasConvertedAvatar: function() {
		return this.avatar.indexOf('data:image') === -1;
	},

	convertAvatar: function() {
		var user = this,
			imgBuffer,
			avatarKey = 'user-avatar-' + user._id + '-v' + user.avatar_v;

		if (user.hasConvertedAvatar()) {
			return;
		}

		imgBuffer = user.avatar.replace(/^data:image\/\w+;base64,/, "");

		helpers.setHostedFile({
			'Key': avatarKey,
			'Body': helpers.base64DecToArr(imgBuffer, 1),
			'ContentType': 'image/jpeg',
			'ACL': 'public-read'
		}, function(err, url) {
			if (err) return;
			user.avatar = avatarKey;
			user.avatar_v++;
			user.save();
		});
	},

	startChangeEmail: function(email) {
		var emailController = require('../controllers/email')(),
			uniqueHash = crypto.randomBytes(20).toString('hex');

		this.pending.email = email;
		this.pending.hash = uniqueHash;

		this.save();

		emailController.send({
			to: email,
			subject: 'Vibe - Verify email',
			templateName: 'verify_email',
			templateData: {
				uniqueHash: uniqueHash,
				userEmail: email
			}
		});
	},

	changeEmailTo: function(email) {
		this.email = email;
		this.pending.email = '';
		this.pending.hash = '';

		this.save();
	},

	generateNewUserPostsFeed: function(cb) {
		var user = this;

		Feedback.find({
			company: user.company,
			status: 'approved'
		}, function(err, feedbacks) {
			var postObjs = [];

			_.each(feedbacks, function(feedback) {
				postObjs.push({
					for_user: user._id,
					company: feedback.company,
					content_type: 'feedback',
					feedback: feedback._id,
					sort_time: feedback.time_status_changed
				});
			});

			Question.find({
				company: user.company
			}, function(err, questions) {
				_.each(questions, function(question) {
					postObjs.push({
						for_user: user._id,
						company: question.company,
						content_type: 'question',
						question: question._id,
						sort_time: question.time_last_sent
					});

					question.addUser(user);
				});

				postObjs = _.sortBy(postObjs, function(postObj) {
					return Date.parse(postObj.sort_time);
				});

				Post.create(postObjs, function(err, posts) {
					if (err) return cb(err);
					cb(null, posts);
				});
			});
		});
	}

}

mongoose.model('User', UserSchema)
