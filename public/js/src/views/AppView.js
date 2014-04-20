import 'backbone';
import 'jquery';
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
		this.$('.survey-notif').html(_.template(surveyTemplate, {
			dueString: '3 days'	
		}));

		_.delay(_.bind(function() {
			this.$('.survey-notif').addClass('show');
		}, this), 1000);
		this.headerView.render();
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
	}

});

export default = AppView;
