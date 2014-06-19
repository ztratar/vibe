import 'backbone';
import 'underscore';
import ConfirmDialogView from 'views/confirmDialogView';
import TimeSeriesChartView from 'views/timeSeriesChartView';
import ChatView from 'views/chatView';
import RatingChartView from 'views/ratingChartView';

module template from 'text!templates/postQuestionItemView.html';

var PostQuestionItemView = Backbone.View.extend({

	tagName: 'li',

	className: 'post-question-item-view',

	template: _.template(template),

	events: {
		'click ul.answers a': 'vote',
		'click a.discuss': 'discuss'
	},

	initialize: function(opts) {
		this.model = opts.model;
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON()
		}));

		this.$voteResultsContainer = this.$('.vote-results-container');
		this.$chartContainer = this.$('.chart-container');

		this.renderChart();
	},

	renderChart: function() {
		var question = this.model.get('question');

		if (question.get('answer_data').length > 1) {
			this.chartView = new TimeSeriesChartView({
				model: this.model.get('question')
			});
		} else {
			this.chartView = new RatingChartView({
				model: this.model.get('question')
			});
		}

		this.$chartContainer.html(this.chartView.$el);
		this.chartView.render();
	},

	vote: function(ev) {
		var $target = $(ev.currentTarget),
			answerBody = parseInt($target.attr('data-answer'), 10);

		this.$voteResultsContainer.addClass('voted');
		this.model.get('question').answer(answerBody);

		return false;
	},

	discuss: function() {
		var chatView = new ChatView({
			chatTitle: this.model.get('question').get('body'),
			chatsUrl: '/api/questions/' + this.model.get('question').get('_id') + '/chats'
		});
		window.Vibe.appView.showOverlay(chatView);

		return false;
	}

});

export default = PostQuestionItemView;
