var _ = require('underscore');

module.exports = function (app, passport) {
	var i,
		routes = {},
		c = controllers = {},
		controllerNames = [
			'users',
			'meta_questions',
			'questions',
			'answers',
			'surveys',
			'access',
			'email',
			'page'
		];

	_.each(controllerNames, function(name) {
		controllers[name] = require('../app/controllers/' + name)(app, passport);
	});

	//
	// API ENDPOINTS
	//
	app.get('/api/users', c.users.get);
	app.get('/api/users/pending', c.users.getPending);
	app.get('/api/meta_questions', c.meta_questions.index);
	app.get('/api/meta_questions/suggested', c.meta_questions.suggested);
	app.get('/api/meta_questions/:meta_question', c.meta_questions.get);
	app.get('/api/questions', c.questions.index);
	app.get('/api/questions/suggested', c.questions.suggested);
	app.get('/api/questions/:question', c.questions.get);
	app.get('/api/questions/:question/comments', c.questions.getComments);
	app.get('/api/answers', c.answers.index);
	app.get('/api/answers/:answer', c.answers.get);
	app.get('/api/surveys', c.surveys.index);
	app.get('/api/survey', c.surveys.lastSurvey);
	app.get('/api/surveys/:survey', c.surveys.get);

	app.post('/api/login', c.users.login);
	app.post('/api/logout', c.users.logout);
	app.post('/api/users', c.users.create);
	app.post('/api/users/:email/forgot_password', c.users.forgot_password);
	app.post('/api/users/:email/reset_password', c.users.reset_password);
	app.post('/api/userinvites', c.users.invite);
	app.post('/api/userinvites/batch_invite', c.users.batchInvite);
	app.post('/api/access/request', c.access.request);
	app.post('/api/access/invite', c.access.invite);
	app.post('/api/meta_questions', c.meta_questions.create);
	app.post('/api/questions', c.questions.create);
	app.post('/api/questions/:question/comments', c.questions.newComment);
	app.post('/api/answers/question/:question/survey/:survey', c.answers.create);
	app.post('/api/surveys', c.surveys.create);

	app.put('/api/users/:id', c.users.update);
	app.put('/api/questions/:question', c.questions.update);
	app.put('/api/surveys/:survey/question/:question', c.surveys.addQuestion);

	app.param('meta_question', c.meta_questions.loadMetaQuestion);
	app.param('question', c.questions.loadQuestion);
	app.param('survey', c.surveys.loadSurvey);
	app.param('answer', c.answers.loadAnswer);

	app.delete('/api/users/:id', c.users.delete);
	app.delete('/api/userinvites/:id', c.users.uninvite);

	//
	// PAGES
	//
	app.get('/login', c.page.login);
	app.get('/register', c.page.register);
	app.get('/registerFromInvite', c.page.registerFromInvite);
	app.get('/forgot_password', c.page.forgot_password);
	app.get('/reset_password', c.page.reset_password);
	app.get('/privacy.html', c.page.privacy);
	app.get('/terms.html', c.page.terms);

	app.get('/admin/invite_company', c.page.admin_invite_company);

	app.get('*', c.page.index);
};
