import 'backbone';
import 'jquery';
import Survey from 'models/survey';
import HeaderView from 'views/HeaderView';
module template from 'text!templates/AppView.html';
module surveyTemplate from 'text!templates/surveyNotification.html';

var AppView = Backbone.View.extend({

	el: 'body',

	className: 'vibe-app app-view',

	initialize: function() {
		this.headerView = new HeaderView();
		this.overrideLinks();
	},

	render: function() {
		this.$el.html(template);
		this.$('.app-header').html(this.headerView.$el);

		this.checkForNewSurvey();
	},

	overrideLinks: function() {
		this.$el.on('click', 'a', function(ev) {
			var $target = $(ev.target),
				href= $target.attr('href'),
				animation = $target.attr('data-animation');

			if (!$target.hasClass('no-override') && href && href.charAt(0) === '/') {
				window.Vibe.appRouter.navigateWithAnimation(href, animation, {
					trigger: true	
				});
				return false;
			}
		});
	},

	checkForNewSurvey: function() {
		var surveyData = {};
		// Check for survey
		if (surveyData) {
			// If survey is found, render the notification and
			// cache the data.
			this.survey = new Survey(surveyData);
			window.Vibe.modelCache.set('survey-' + this.survey.get('_id'), this.survey.toJSON());	
			this.renderAndShowSurveyNotification();
		}
	},

	renderAndShowSurveyNotification: function() {
		var msTimeDiff = (new Date()).getTime() - this.survey.get('timeDue').getTime(),
			daysTime = Math.floor(msTimeDiff / (1000 * 60 * 60 * 24)),
			dueString = 'Take Survey - Due in ' + daysTime + ' days';

		if (daysTime === 0) {
			dueString = 'Take Survey - Due Now!';	
		}

		this.$('.survey-notif').html(_.template(surveyTemplate, {
			dueString: dueString	
		}));

		this.$('.survey-notif').addClass('show');
		this.$('.survey-notif').click(function() {
			window.Vibe.appRouter.navigateWithAnimation('/survey/03993029', 'slideUp', {
				trigger: true,
				screenSize: 'full'
			});	
			$(this).removeClass('show');
		});
	}

});

export default = AppView;
