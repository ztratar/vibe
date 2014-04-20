module.exports = function (app, passport) {
  // user routes
  var users = require('../app/controllers/users');
  app.get('/login', users.login);
  app.get('/signup', users.signup);
  app.get('/logout', users.logout);
  app.post('/users', users.create);
  app.post('/users/session', 
    function(req, res, next){
      req.body.email = req.body.email.toLowerCase();

      next();
    }, passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password.'
    }),
    users.session);
  
  var metaQuestions = require('../app/controllers/meta_questions');
  app.get('/api/meta_questions', metaQuestions.index);
  app.get('/api/meta_questions/:id', metaQuestions.get);
  app.post('/api/meta_questions', metaQuestions.create);
  app.delete('/api/meta_questions/:id', metaQuestions.delete);

  var questions = require('../app/controllers/questions');
  app.get('/api/questions', questions.index);
  app.get('/api/questions/:id', questions.get);
  app.post('/api/questions', questions.create);
  app.delete('/api/questions/:id', questions.delete);

  var answers = require('../app/controllers/answers');
  app.get('/api/answers', answers.index);
  app.get('/api/answers/:id', answers.get);
  app.post('/api/answers', answers.create);
  app.delete('/api/answers/:id', answers.delete);


  var surveys = require('../app/controllers/surveys');
  app.get('/api/surveys', surveys.index);
  app.get('/api/surveys/:id', surveys.get);
  app.post('/api/surveys', surveys.create);
  app.put('/api/surveys/:id/:questionId', surveys.addQuestion);
  // app.delete('/api/surveys/:id/:questionId', surveys.deleteQuestion);
  app.delete('/api/surveys/:id', surveys.delete);


  // app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email', 'user_about_me'], failureRedirect: '/login' }), users.signin);
  // app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), users.authCallback);
  // app.get('/auth/github', passport.authenticate('github', { failureRedirect: '/login' }), users.signin);
  // app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), users.authCallback);
  // app.get('/auth/twitter', passport.authenticate('twitter', { failureRedirect: '/login' }), users.signin);
  // app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), users.authCallback);
  // app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] }));
  // app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', successRedirect: '/' })); 
  
  // app.get('/', function(req, res){
  //   if(req.isAuthenticated()){
  //     res.render('home/index');
  //   } else {
  //     res.render('splash/index');
  //   }
  // });

  app.get('*', function(req, res){
    if(req.isAuthenticated()){
      console.log(req.user);
      res.render('home/index');
    } else {
      res.render('splash/index');
    }
  });

};
