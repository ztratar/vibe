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

  app.get('/api/users', users.get);
  app.put('/api/users', users.update);
  
  var metaQuestions = require('../app/controllers/meta_questions');
  var questions = require('../app/controllers/questions');
  var answers = require('../app/controllers/answers');
  var surveys = require('../app/controllers/surveys');

  app.param('meta_question', metaQuestions.loadMetaQuestion);
  app.param('question', questions.loadQuestion);
  app.param('survey', surveys.loadSurvey);
  app.param('answer', answers.loadAnswer);




  app.get('/api/meta_questions', metaQuestions.index);
  app.get('/api/meta_questions/:meta_question', metaQuestions.get);
  app.post('/api/meta_questions', metaQuestions.create);
  app.delete('/api/meta_questions/:meta_question', metaQuestions.delete);

  app.get('/api/questions', questions.index);
  app.get('/api/questions/:question', questions.get);
  app.post('/api/questions', questions.create);
  app.delete('/api/questions/:question', questions.delete);

  app.post('/api/questions/:question/comments', questions.newComment);

  app.get('/api/answers', answers.index);
  app.get('/api/answers/:answer', answers.get);
  app.post('/api/answers/question/:question/survey/:survey', answers.create);
  app.delete('/api/answers/:answer', answers.delete);


  app.get('/api/surveys', surveys.index);
  app.get('/api/surveys/:survey', surveys.get);
  app.post('/api/surveys', surveys.create);
  app.put('/api/surveys/:survey/question/:question', surveys.addQuestion);
  // app.delete('/api/surveys/:id/:questionId', surveys.deleteQuestion);
  app.delete('/api/surveys/:survey', surveys.delete);


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
