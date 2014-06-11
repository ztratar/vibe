import 'backbone';

import Questions from 'models/questions';
import ChartsView from 'views/chartsView';

import PostOverlayView from 'views/postOverlayView';

module template from 'text!templates/homeView.html';
module newChartsLockedTemplate from 'text!templates/newChartsLocked.html';
module surveySummaryCardTemplate from 'text!templates/surveySummaryCard.html';

var HomeView = Backbone.View.extend({

	className: 'home-view',

	template: _.template(template),

	events: {
		'click a.new-post': 'newPost'
	},

	initialize: function() {
		this.questions = new Questions();
		this.chartsView = new ChartsView({
			collection: this.questions
		});
		this.surveyTaken = false;
	},

	render: function() {
		this.$el.html(this.template({
			user: window.Vibe.user.toJSON()
		}));

		this.$newPostButton = this.$('a.new-post');

		this.$('.charts-container').html(this.chartsView.$el);
		this.questions.reset([{
			body: 'Design Deliverables seem...',
			answer_data: {
				0: 3.7,
				1: 3.2,
				2: 3.6,
				3: 4,
				4: 4,
				5: 0,
				6: 0,
				7: 2,
				8: 1.8,
				9: 2.7
			}
		}, {
			body: 'Productivity is going...',
			answer_data: {
				0: 3.2,
				1: 1.4,
				2: 3.1,
				3: 3.2,
				4: 2.7,
				5: 3.7,
				6: 3,
				7: 2.3,
				8: 2.8,
				9: 2
			}
		}, {
			body: 'We focus on our goals...',
			answer_data: {
				0: 3.7,
				1: 3.2,
				2: 3.6,
				3: 2.7,
				4: 2.1,
				5: 3.2,
				6: 3.8,
				7: 2,
				8: 1.8,
				9: 2.7
			}
		}, {
			body: 'Vibe is going...',
			answer_data: {
				0: 4.0,
				1: 3.8,
				2: 3.7,
				3: 3.6,
				4: 3.5,
				5: 3.4,
				6: 3.2,
				7: 2.8,
				8: 3.0,
				9: 3.1
			}
		}]);
		if (!this.surveyTaken) {
			this.chartsView.$el.prepend(_.template(surveySummaryCardTemplate, {
				title: 'Last week',
				response_times: {
					best: '3 mins',
					median: '7 hrs, 3 mins',
					you: '3 days, 7 hrs'
				},
				completed: '87%',
				numUsers: 24,
				numCompleted: 21
			}));
			this.chartsView.$el.prepend(newChartsLockedTemplate);
		} else {
			this.chartsView.$el.prepend(_.template(surveySummaryCardTemplate, {
				title: 'This week',
				response_times: {
					best: '1 mins',
					median: 'Calculating...',
					you: '1 hr, 50 mins'
				},
				completed: '8%',
				numUsers: 24,
				numCompleted: 2
			}));
		}

		return this;
	},

	newPost: function() {
		var postOverlayView = new PostOverlayView();

		this.$('.post-overlay-container').html(postOverlayView.$el);
		postOverlayView.render();

		this.$newPostButton.addClass('fadeOut');
		postOverlayView.animateIn();

		postOverlayView.on('remove', _.bind(function() {
			this.$newPostButton.removeClass('fadeOut');
		}, this));

		return false;
	}

});

export default = HomeView;
