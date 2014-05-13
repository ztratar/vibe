import 'backbone';
import 'jquery';
import Survey from 'models/survey';
import HeaderView from 'views/headerView';
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
		var that = this;

		this.survey = new Survey();
		this.survey.fetchNewSurvey({
			success: function(model, data) {
				if (!data._id) return;
				window.Vibe.modelCache.set('survey-' + model.get('_id'), model.toJSON());
				that.renderAndShowSurveyNotification();
			}
		});
	},

	renderAndShowSurveyNotification: function() {
		var msTimeDiff = (new Date()).getTime() - this.survey.get('timeDue').getTime(),
			daysTime = Math.floor(msTimeDiff / (1000 * 60 * 60 * 24)),
			dueString = 'Take Survey - Due in ' + daysTime + ' days',
			that = this;

		if (daysTime === 0) {
			dueString = 'Take Survey - Due Now!';
		}

		this.$('.survey-notif').html(_.template(surveyTemplate, {
			dueString: dueString
		}));

		this.$el.addClass('survey-show');

		this.$('.survey-notif').off('click touchstart').on('click touchstart', _.bind(function() {
			window.Vibe.appRouter.navigateWithAnimation('/survey/' + that.survey.get('_id'), 'slideUp', {
				trigger: true,
				screenSize: 'full'
			});	
			this.$el.removeClass('survey-show');

			return false;
		}, this));
	}

});

export default = AppView;
