import 'backbone';

import Feedbacks from 'models/feedbacks';
import FeedbackApprovalItemView from 'views/feedbackApprovalItemView';

module template from 'text!templates/feedbackApprovalView.html';

var FeedbackApprovalView = Backbone.View.extend({

	className: 'feedback-approval-view',

	template: _.template(template),

	initialize: function(opts) {
		var that = this;

		this.feedback = new Feedbacks();
		this.feedback.url = window.Vibe.serverUrl + 'api/feedback/pending';

		this.feedback.on('reset', this.render, this);
		this.feedback.on('add', this.addOne, this);
		this.feedback.on('all', this.determineVisibility, this);

		_.defer(_.bind(function() {
			this.feedback.fetch({
				reset: true
			});
		}, this));

		window.Vibe.faye.subscribe('/api/feedback/pending', function(data) {
			that.feedback.add(data);
		});
	},

	determineVisibility: function() {
		if (!this.feedback.where({ status: 'pending' }).length) {
			this.$el.hide();
		} else {
			this.$el.show();
		}
	},

	render: function() {
		this.$el.html(this.template());
		this.$pendingFeedback = this.$('.pending-feedback');
		this.addAll();

		return this;
	},

	addAll: function() {
		this.feedback.each(_.bind(this.addOne, this));
	},

	addOne: function(feedback) {
		var feedbackApprovalItem = new FeedbackApprovalItemView({
			model: feedback,
			feedbacks: this.feedback
		});

		this.$pendingFeedback.append(feedbackApprovalItem.$el);
		feedbackApprovalItem.render();
	}

});

export default = FeedbackApprovalView;
