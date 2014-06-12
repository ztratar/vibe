import 'backbone';

import Feedbacks from 'models/feedbacks';
import FeedbackApprovalItemView from 'views/feedbackApprovalItemView';

module template from 'text!templates/feedbackApprovalView.html';

var FeedbackApprovalView = Backbone.View.extend({

	className: 'feedback-approval-view',

	template: _.template(template),

	initialize: function(opts) {
		this.feedback = new Feedbacks();
		this.feedback.url = '/api/feedback/pending';

		this.feedback.on('all', this.render, this);

		_.defer(_.bind(function() {
			this.feedback.fetch();
		}, this));
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
			model: feedback
		});

		this.$pendingFeedback.append(feedbackApprovalItem.$el);
		feedbackApprovalItem.render();
	}

});

export default = FeedbackApprovalView;
