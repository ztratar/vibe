
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , Company = mongoose.model('Company')
  , Async = require('async');



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

  var domain = req.body.companyDomain;
  var company = new Company({
    name: req.body.companyName,
    domain: domain
  });

  var newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    isAdmin: true,
    provider: 'local',
    company: company._id
  });

  Async.waterfall([
    function(cb){
      User.findOne({email: newUser.email},function(err, user){
        if(err) return cb(err);
        if(user){
          return res.render('users/signup', { errors: [{"message":"email already registered"}], user:newUser });
        }
        return cb(null);
      });
    },
    // try to create the company
    function(cb){
      Company.findOne({domain: domain}, function(err, company){
        if(err) return cb(err);
        if(company){
          return res.render('users/signup', { errors: [{"message":"Company already exists"}], user:newUser });
        }
        return cb(null);
      });
    },
    // create the company
    function(cb){
      company.save(function(err){
        if (err) { console.log(err); return res.render('users/signup', { errors: err.errors, user:newUser }); } 
        return cb(null, company);
      });
    },
    // save user
    function(company, cb){
      newUser.save(function(err){
        if (err) { console.log(err); return res.render('users/signup', { errors: err.errors, user:newUser }); } 
        return cb(null, company, newUser);
      });
    }], function(err, company, user){
      if(err){
        console.error("splat");
        console.error(err.stack);
        return res.send(500, {error: "splat"});
      }
      //log the user in
      req.logIn(user, function(err) {
        if (err){
          console.error("splat");
          console.error(err.stack);
          return res.send(500, {error: "splat"});
        }
        return res.redirect('/');
      });
    });
}

/**
* get /api/users
* get current user
*/
exports.get = function(req, res, next){
  return res.send(req.user.stripInfo());
}


/**
* PUT /api/users
* query strings:
*/
exports.update = function(req, res, next){

  var user = req.user;
  var body = req.body;

  if(body.tutorial) user.tutorial = JSON.stringify(body.tutorial);
  if(body.name) user.name = body.name;
  if(body.password) user.password = body.password;


  req.user.save(function(err, user){
    if(err) return next(err);

    return res.send(user.stripInfo());
  });
};



/**
 * Find user by id
 */

// exports.loadUser = function (req, res, next, id) {
//   User
//     .findOne({ _id : id })
//     .exec(function (err, user) {
//       if (err) return next(err)
//       if (!user) return next(new Error('Failed to load User ' + id))
//       req.profile = user
//       next()
//     });
// }
