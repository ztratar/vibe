var _ = require('underscore'),
	helpers = require('../app/helpers'),
	s = helpers.security;

module.exports = function (app, passport) {
	var i,
		routes = {},
		c = controllers = {},
		controllerNames = [
			'users',
			'company',
			'meta_questions',
			'questions',
			'access',
			'email',
			'page',
			'feedback',
			'posts',
			'notifications',
			'chat'
		];

	_.each(controllerNames, function(name) {
		controllers[name] = require('../app/controllers/' + name)(app, passport);
	});

	//
	// API ENDPOINTS
	//
	app.get('/api/users', s.requireLogin, c.users.get);
	app.get('/api/users/me', s.requireLogin, c.users.getCurrentUser);
	app.get('/api/users/pending', s.requireAdmin, c.users.getPending);
	app.get('/api/users/admins', s.requireLogin, c.users.getAdmins);
	app.get('/api/meta_questions', s.requireLogin, c.meta_questions.index);
	app.get('/api/meta_questions/suggested', s.requireLogin, c.meta_questions.suggested);
	app.get('/api/meta_questions/:meta_question', s.requireLogin, c.meta_questions.get);
	app.get('/api/questions', s.requireLogin, c.questions.index);
	app.get('/api/questions/suggested', s.requireLogin, c.questions.suggested);
	app.get('/api/questions/:question', s.requireLogin, c.questions.get);
	app.get('/api/questions/:question/chats', s.requireLogin, c.questions.getChats);
	app.get('/api/feedback/pending', s.requireAdmin, c.feedback.pending);
	app.get('/api/feedback/:feedback', s.requireLogin, c.feedback.get);
	app.get('/api/feedback/:feedback/chats', s.requireLogin, c.feedback.getChats);
	app.get('/api/posts', s.requireLogin, c.posts.index);
	app.get('/api/notifications', s.requireLogin, c.notifications.index);
	app.get('/api/logout', c.users.logout);

	app.post('/api/login', c.users.login);
	app.post('/api/logout', c.users.logout);
	app.post('/api/users', c.users.create);
	app.post('/api/users/:email/forgot_password', c.users.forgot_password);
	app.post('/api/users/:email/reset_password', c.users.reset_password);
	app.post('/api/userinvites', s.requireAdmin, c.users.invite);
	app.post('/api/userinvites/batch_invite', s.requireAdmin, c.users.batchInvite);
	app.post('/api/access/request', c.access.request);
	app.post('/api/access/invite', s.requireSuperAdmin, c.access.invite);
	app.post('/api/meta_questions', s.requireAdmin, c.meta_questions.create);
	app.post('/api/questions', s.requireAdmin, c.questions.create);
	app.post('/api/questions/:question/chats', s.requireLogin, c.questions.newChat);
	app.post('/api/questions/:question/send_now', s.requireAdmin, c.questions.sendNow);
	app.post('/api/questions/:question/answers', s.requireLogin, c.questions.createAnswer);
	app.post('/api/feedback', s.requireLogin, c.feedback.create);
	app.post('/api/feedback/:feedback/chats', s.requireLogin, c.feedback.newChat);

	app.put('/api/users/:id', s.requireLogin, c.users.update);
	app.put('/api/company/:id', s.requireAdmin, c.company.update);
	app.put('/api/questions/:question', s.requireLogin, c.questions.update);
	app.put('/api/questions/:question/leave_chat', s.requireLogin, c.questions.leaveChatRoom);
	app.put('/api/questions/:question/remove_posts', s.requireAdmin, c.questions.removePosts);
	app.put('/api/feedback/:feedback', s.requireLogin, c.feedback.update);
	app.put('/api/feedback/:feedback/agree', s.requireLogin, c.feedback.agree);
	app.put('/api/feedback/:feedback/undo_agree', s.requireLogin, c.feedback.undoAgree);
	app.put('/api/feedback/:feedback/leave_chat', s.requireLogin, c.feedback.leaveChatRoom);
	app.put('/api/notifications/mark_read', s.requireLogin, c.notifications.markRead);

	app.param('feedback', c.feedback.loadFeedback);
	app.param('meta_question', c.meta_questions.loadMetaQuestion);
	app.param('question', c.questions.loadQuestion);

	app.delete('/api/users/:id', s.requireAdmin, c.users.delete);
	app.delete('/api/userinvites/:id', s.requireAdmin, c.users.uninvite);
	app.delete('/api/feedback/:feedback', s.requireAdmin, c.feedback.delete);
	app.delete('/api/chats/:id', s.requireLogin, c.chat.delete);

	//
	// PAGES
	//
	app.get('/login', c.page.login);
	app.get('/register', c.page.register);
	app.get('/registerFromInvite', c.page.registerFromInvite);
	app.get('/forgot_password', c.page.forgot_password);
	app.get('/reset_password', c.page.reset_password);
	app.get('/change_email', c.page.change_email);
	app.get('/privacy.html', c.page.privacy);
	app.get('/terms.html', c.page.terms);

	app.get('/admin/invite_company', s.requireSuperAdmin, c.page.admin_invite_company);
	app.get('/api/admin/users', s.requireSuperAdmin, c.users.getAllUsers);
	app.get('/api/admin/users/:user/regenerate_feed', s.requireSuperAdmin, c.users.regenerateFeed);

	app.get('*', c.page.index);
};
