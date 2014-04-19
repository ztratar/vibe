module.exports = function (app, passport) {
  // user routes
  var users = require('../app/controllers/users');
  app.get('/login', users.login);
  app.get('/signup', users.signup);
  app.get('/logout', users.logout);
  app.post('/users', users.create);
  app.post('/users/session', passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid email or password.'}), users.session);
  

  var questions = require('../app/controllers/questions');
  app.get('/questions/:id', questions.get);
  app.post('/questions/metaId', questions.create);
  app.delete('/questions/:id', questions.delete);


  // app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email', 'user_about_me'], failureRedirect: '/login' }), users.signin);
  // app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), users.authCallback);
  // app.get('/auth/github', passport.authenticate('github', { failureRedirect: '/login' }), users.signin);
  // app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), users.authCallback);
  // app.get('/auth/twitter', passport.authenticate('twitter', { failureRedirect: '/login' }), users.signin);
  // app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), users.authCallback);
  // app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] }));
  // app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', successRedirect: '/' })); 
  
  app.get('/', function(req, res){
    console.log(req.user)

    if(req.isAuthenticated()){
      res.render('home/index');
    } else {
      res.render('splash/index');
    }
  });

  app.get('*', function(req, res){
    res.redirect('/');
  });
}
