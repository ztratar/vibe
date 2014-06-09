import 'jquery';
import 'underscore';
import 'backbone';

import ScreenRouter from 'screenRouter';

import Survey from 'models/survey';
import Question from 'models/question';

import HomeView from 'views/homeView';
import WelcomeView from 'views/welcomeView';
import SurveyView from 'views/surveyView';
import SurveyDoneView from 'views/surveyDoneView';
import DiscussView from 'views/discussView';

import SettingsView from 'views/settingsView';
import SettingsEditFieldView from 'views/settingsEditFieldView';

var Router = Backbone.Router.extend({

	initialize: function() {
		this.screenRouter = new ScreenRouter();
		this.screenRouter.initCurrentScreen();
	},

	routes: {
		'index.html': 'index',
		'': 'index',
		'/': 'index',
		'settings': 'settings',
		'settings/name': 'settingsName',
		'settings/email': 'settingsEmail',
		'settings/password': 'settingsPassword',
		'welcome/:step': 'welcome',
		'discuss/:id': 'discuss',
		'survey/:tag': 'survey',
		'surveyDone': 'surveyDone'
	},

	index: function() {
		var that = this;

		// Started tutorial system to test screenRouter
		if (false && !window.Vibe.user.get('seenTutorial')) {
			this.navigate('welcome/1', { trigger: true });
			return;
		}

		window.Vibe.appView.headerView.setButtons({
			title: 'vibe',
			rightAction: {
				title: '',
				icon: '#61886',
				click: function(ev) {
					var $target = $(ev.target);
					that.navigateWithAnimation('settings', 'pushLeft', {
						trigger: true
					});
					return false;
				}
			}
		});

		this.homeView = this.homeView || new HomeView();
		this.screenRouter.currentScreenContainer.html(this.homeView.$el);

		this.homeView.render();

		this.trigger('loaded');
	},

	welcome: function(step) {
		var welcomeView = new WelcomeView();

		this.screenRouter.currentScreen.addClass('full');
		this.screenRouter.currentScreenContainer.html(welcomeView.$el);
		welcomeView.render();

		if (step === '2') {
			welcomeView.$el.html('test');
		}

		this.trigger('loaded');
	},

	settings: function() {
		var that = this,
			settingsView = new SettingsView({
				user: window.Vibe.user
			});

		window.Vibe.appView.headerView.setButtons({
			title: 'settings',
			leftAction: {
				icon: '#61903',
				title: '',
				click: function(ev) {
					that.navigateWithAnimation('/', 'pushRight', {
						trigger: true
					});
					return false;
				}
			}
		});

		this.screenRouter.currentScreenContainer.html(settingsView.$el);
		settingsView.render();

		this.trigger('loaded');
	},

	settingsName: function() {
		var that = this,
			settingsEditFieldView = new SettingsEditFieldView({
				title: 'Name',
				model: window.Vibe.user,
				attributeName: 'name',
				placeholder: 'Full Name',
				confirm: false,
				helperText: 'Please enter your full name. Your identity is only visible in chat.'
			});

		window.Vibe.appView.headerView.setButtons({
			title: 'Name',
			leftAction: {
				icon: '',
				title: 'Cancel',
				click: function(ev) {
					that.navigateWithAnimation('/settings', 'pushRight', {
						trigger: true
					});
					return false;
				}
			},
			rightAction: {
				title: 'Save',
				click: function() {
					settingsEditFieldView.saveField();
					return false;
				}
			}
		});

		this.screenRouter.currentScreenContainer.html(settingsEditFieldView.$el);
		settingsEditFieldView.render();

		this.trigger('loaded');
	},

	settingsEmail: function() {
		var that = this,
			settingsEditFieldView = new SettingsEditFieldView({
				title: 'Email',
				model: window.Vibe.user,
				attributeName: 'email',
				placeholder: 'Ex: your@email.com',
				confirm: false,
				helperText: 'After clicking save, we will send you a confirmation email to complete the change.'
			});

		window.Vibe.appView.headerView.setButtons({
			title: 'Email',
			leftAction: {
				icon: '',
				title: 'Cancel',
				click: function(ev) {
					that.navigateWithAnimation('/settings', 'pushRight', {
						trigger: true
					});
					return false;
				}
			},
			rightAction: {
				title: 'Save',
				click: function() {
					settingsEditFieldView.saveField();
					return false;
				}
			}
		});

		this.screenRouter.currentScreenContainer.html(settingsEditFieldView.$el);
		settingsEditFieldView.render();

		this.trigger('loaded');
	},

	settingsPassword: function() {
		var that = this,
			settingsEditFieldView = new SettingsEditFieldView({
				title: 'Password',
				model: window.Vibe.user,
				attributeName: 'password',
				placeholder: 'Make it great!',
				confirm: true,
				fieldType: 'password',
				helperText: 'After clicking save, we will send you a confirmation email to complete the change.'
			});

		window.Vibe.appView.headerView.setButtons({
			title: 'Password',
			leftAction: {
				icon: '',
				title: 'Cancel',
				click: function(ev) {
					that.navigateWithAnimation('/settings', 'pushRight', {
						trigger: true
					});
					return false;
				}
			},
			rightAction: {
				title: 'Save',
				click: function() {
					settingsEditFieldView.saveField();
					return false;
				}
			}
		});

		this.screenRouter.currentScreenContainer.html(settingsEditFieldView.$el);
		settingsEditFieldView.render();

		this.trigger('loaded');
	},


	discuss: function(questionId) {
		var that = this,
			discussView,
			qData = window.Vibe.modelCache.getAndRemove('question-' + questionId),
			question;

		if (qData) {
			question = new Question(qData);
		} else {
			question = new Question({
				_id: questionId
			});
			_.defer(question.fetch);
		}

		discussView = new DiscussView({
			model: question
		});

		window.Vibe.appView.headerView.setButtons({
			title: question.get('title'),
			headerSize: 'small',
			leftAction: {
				icon: '#61903',
				title: '',
				click: function(ev) {
					that.navigateWithAnimation('/', 'pushRight', {
						trigger: true
					});
					return false;
				}
			}
		});

		this.screenRouter.currentScreenContainer.html(discussView.$el);
		discussView.render();

		this.trigger('loaded');
	},

	survey: function(surveyId) {
		var surveyData = window.Vibe.modelCache.getAndRemove('survey-' + surveyId),
			surveyView,
			survey;

		if (surveyData) {
			survey = new Survey(surveyData);
		} else {
			survey = new Survey({
				id: surveyId
			});
			_.defer(survey.fetch);
		}

		surveyView = new SurveyView({
			model: survey
		});

		this.screenRouter.currentScreenContainer.html(surveyView.$el);
		surveyView.render();

		this.trigger('loaded');
	},

	surveyDone: function() {
		var that = this,
			surveyDoneView = new SurveyDoneView();

		this.homeView.surveyTaken = true;

		window.Vibe.appView.headerView.setButtons({
			title: '',
			leftAction: {
				icon: '#61903',
				title: 'vibe',
				click: function(ev) {
					that.navigateWithAnimation('/', 'pushRight', {
						trigger: true
					});
					return false;
				}
			}
		});

		this.screenRouter.currentScreenContainer.html(surveyDoneView.$el);
		surveyDoneView.render();

		this.trigger('loaded');
	}

});

_.extend(Router.prototype, {

	navigateWithAnimation: function(href, animation, opts) {
		opts = _.extend({
			waitForLoad: false,
			screenSize: 'std'
		}, opts);

		this.screenRouter.createNewScreen(opts.screenSize);

		if (opts.waitForLoad) {
			// TODO: Ajax Loader
			this.once('loaded', _.bind(function() {
				this.screenRouter.animateScreens(animation);
				window.Vibe.appView.headerView.animateToNewComponents(animation);
			}, this));
			this.navigate(href, opts);
		} else {
			this.screenRouter.animateScreens(animation);
			this.navigate(href, opts);
			window.Vibe.appView.headerView.animateToNewComponents(animation);
		}
	}

});

var initRouter = function() {
	window.Vibe.appRouter = new Router();

	window.Vibe.appRouter.once('loaded', function() {
		window.Vibe.appView.headerView.renderCurrentComponents();
	});

	Backbone.history.start({
		pushState: true,
		root: '/'
	});
	window.Vibe.appRouter.navigate('/', {
		trigger: true
	});
};

export default = { init: initRouter };
