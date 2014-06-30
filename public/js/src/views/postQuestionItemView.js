import 'underscore';
import 'backbone';

import ConfirmDialogView from 'views/confirmDialogView';
import PostChatView from 'views/postChatView';
import TimeSeriesChartView from 'views/timeSeriesChartView';
import RatingChartView from 'views/ratingChartView';

module template from 'text!templates/postQuestionItemView.html';
module actionBarTemplate from 'text!templates/postQuestionItemActionBar.html';

var PostChatView = require('views/postChatView');

var PostQuestionItemView = Backbone.View.extend({

	className: 'post-question-item-view',

	template: _.template(template),
	actionBarTemplate: _.template(actionBarTemplate),

	events: {
		'click ul.answers a': 'vote',
		'click a.discuss': 'discuss'
	},

	initialize: function(opts) {
		if (opts.model) {
			this.model = opts.model;
			this.model.on('destroy', this.remove, this);
			this.question = this.model.get('question');
		} else if (opts.question) {
			this.question = opts.question;
			this.question.once('change', this.render, this);
		}

		this.chartDelay = opts.chartDelay || 0;
		this.forceSmallChart = opts.forceSmallChart || false;

		this.initChat();
	},

	render: function() {
		this.$el.html(this.template({
			question: this.question
		}));

		this.$voteResultsContainer = this.$('.vote-results-container');
		this.$chartContainer = this.$('.chart-container');
		this.$actionBarContainer = this.$('.action-bar');

		_.delay(_.bind(function() {
			this.renderChart();
		}, this), this.chartDelay);

		this.renderActionBar();
	},

	renderActionBar: function() {
		this.$actionBarContainer.html(this.actionBarTemplate({
			numUnread: this.numUnread
		}));
	},

	renderChart: function() {
		var question = this.question;

		if (question.get('answer_data').length > 1) {
			this.chartView = new TimeSeriesChartView({
				model: this.question,
				forceSmallChart: this.forceSmallChart
			});
		} else {
			this.chartView = new RatingChartView({
				model: this.question,
				forceSmallChart: this.forceSmallChart
			});
		}

		this.$chartContainer.html(this.chartView.$el);
		this.chartView.render();
	},

	vote: function(ev) {
		var $target = $(ev.currentTarget),
			answerBody = parseInt($target.attr('data-answer'), 10);

		this.$voteResultsContainer.addClass('voted');
		this.question.answer(answerBody);

		return false;
	},

	discuss: function() {
		this.postChatView = new PostChatView.default({
			post: this.model,
			question: this.question
		});
		window.Vibe.appView.showOverlay(this.postChatView);

		this.markChatOpened();

		window.Vibe.appRouter.navigate('/question/' + this.question.get('_id'));

		return false;
	},



	// ************
	// CHAT METHODS
	// ************

	initChat: function() {
		var that = this,
			totalChats = this.question.get('chat').num_chats,
			chatsLastSeen = this.question.get('chat').chats_last_seen,
			myLastSeen = chatsLastSeen ? chatsLastSeen[window.Vibe.user.get('_id')] : false;

		if (myLastSeen) {
			this.numUnread = totalChats - myLastSeen;
		} else {
			this.numUnread = totalChats;
		}
		this.chatOpen = false;

		window.Vibe.faye.subscribe(window.Vibe.serverUrl + 'api/questions/' + this.question.get('_id') + '/chats', function(newChat) {
			if (!that.chatOpen) {
				that.numUnread++;
				that.renderActionBar();
			}
		});
	},

	markChatOpened: function() {
		this.chatOpen = true;
		this.numUnread = 0;
		this.renderActionBar();

		this.postChatView.on('remove', _.bind(function() {
			this.chatOpen = false;
			this.question.leaveChat();
			this.postChatView = undefined;
		}, this));
	}

});

export default = PostQuestionItemView;
