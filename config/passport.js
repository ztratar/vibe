
var mongoose = require('mongoose')
	LocalStrategy = require('passport-local').Strategy,
	User = mongoose.model('User');

module.exports = function (passport, config) {
	// require('./initializer')

	// serialize sessions
	passport.serializeUser(function(user, done) {
		done(null, user.id)
	})

	passport.deserializeUser(function(id, done) {
		console.log('-> User deserializing', id);
		User.findOne({ _id: id })
			.populate('company')
			.exec(function (err, user) {
				done(err, user)
			});
	})

	// use local strategy
	passport.use(new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password'
		},
		function(email, password, done) {
			console.log('-> Passport auth local strategy');
			User.findOne({ email: email }, function (err, user) {
				if (err) { return done(err) }
				if (!user) {
					return done(null, false, { message: 'Unknown user' })
				}
				if (!user.authenticate(password)) {
					return done(null, false, { message: 'Invalid password' })
				}
				return done(null, user)
			})
		}
	))
}
