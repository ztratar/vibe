
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , User = mongoose.model('User');



exports.auth = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login')
  }
  next()
};


exports.signin = function (req, res) {}

/**
 * Auth callback
 */

exports.authCallback = function (req, res, next) {
  res.redirect('/');
}

/**
 * Show login form
 */

exports.login = function (req, res) {
  if(req.isAuthenticated()){
    res.redirect('/');
  } else {
    res.render('users/login', {
      title: 'Login',
      message: req.flash('error')
    });
  }
}

/**
 * Show sign up form
 */

exports.signup = function (req, res) {
  res.render('users/signup', {
    title: 'Sign up',
    user: new User()
  });
}

/**
 * Logout
 */

exports.logout = function (req, res) {
  req.logout();
  res.redirect('/login');
}

/**
 * Session
 */

exports.session = function (req, res) {
  res.redirect('/');
}

/**
 * Create user
 */

exports.create = function (req, res) {
  var newUser = new User(req.body);
  newUser.isAdmin = true;
  newUser.provider = 'local';

  User
    .findOne({ email: newUser.email })
    .exec(function(err, user){
      if(err) return next(err)
      if(!user){
        newUser.save(function(err){
          if (err) { console.log(err); return res.render('users/signup', { errors: err.errors, user:newUser }); } 

          req.logIn(newUser, function(err) {
            if (err) return next(err) 
            return res.redirect('/')
          });
        });
      } else {
        return res.render('users/signup', { errors: [{"message":"email already registered"}], user:newUser })
      }
    });
}


/**
 * Find user by id
 */

exports.user = function (req, res, next, id) {
  User
    .findOne({ _id : id })
    .exec(function (err, user) {
      if (err) return next(err)
      if (!user) return next(new Error('Failed to load User ' + id))
      req.profile = user
      next()
    });
}
