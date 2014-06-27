import 'backbone';
import 'underscore';
import ConfirmDialogView from 'views/confirmDialogView';
import TimeSeriesChartView from 'views/timeSeriesChartView';
import ChatView from 'views/chatView';
import RatingChartView from 'views/ratingChartView';

module template from 'text!templates/postQuestionItemView.html';
module actionBarTemplate from 'text!templates/postQuestionItemActionBar.html';

var PostQuestionItemView = Backbone.View.extend({

	tagName: 'li',

	className: 'post-question-item-view',

	template: _.template(template),
	actionBarTemplate: _.template(actionBarTemplate),

	events: {
		'click ul.answers a': 'vote',
		'click a.discuss': 'discuss'
	},

	initialize: function(opts) {
		this.model = opts.model;
		this.model.on('destroy', this.remove, this);

		this.initChat();
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON()
		}));

		this.$voteResultsContainer = this.$('.vote-results-container');
		this.$chartContainer = this.$('.chart-container');
		this.$actionBarContainer = this.$('.action-bar');

		this.renderChart();
		this.renderActionBar();
	},

	renderActionBar: function() {
		this.$actionBarContainer.html(this.actionBarTemplate({
			numUnread: this.numUnread
		}));
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
		this.chatView = new ChatView({
			chatTitle: this.model.get('question').get('body'),
			chatsUrl: window.Vibe.serverUrl + '/api/questions/' + this.model.get('question').get('_id') + '/chats'
		});
		window.Vibe.appView.showOverlay(this.chatView);

		this.markChatOpened();

		return false;
	},



	// ************
	// CHAT METHODS
	// ************

	initChat: function() {
		var that = this,
			totalChats = this.model.get('question').get('chat').num_chats,
			chatsLastSeen = this.model.get('question').get('chat').chats_last_seen,
			myLastSeen = chatsLastSeen ? chatsLastSeen[window.Vibe.user.get('_id')] : false;

		if (myLastSeen) {
			this.numUnread = totalChats - myLastSeen;
		} else {
			this.numUnread = totalChats;
		}
		this.chatOpen = false;

		window.Vibe.faye.subscribe(window.Vibe.serverUrl + '/api/questions/' + this.model.get('question').get('_id') + '/chats', function(newChat) {
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

		this.chatView.on('remove', _.bind(function() {
			this.chatOpen = false;
			this.model.get('question').leaveChat();
			this.chatView = undefined;
		}, this));
	}

});

export default = PostQuestionItemView;
