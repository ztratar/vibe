define("views/feedbackApprovalView", 
  ["backbone","models/feedbacks","views/feedbackApprovalItemView","text!templates/feedbackApprovalView.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";

    var Feedbacks = __dependency2__["default"];
    var FeedbackApprovalItemView = __dependency3__["default"];

    var template = __dependency4__;

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
    		if (!this.feedback.length ) {
    			this.$el.hide();
    		} else {
    			this.$el.show();
    			this.$el.html(this.template());
    			this.$pendingFeedback = this.$('.pending-feedback');
    			this.addAll();
    		}

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

    __exports__["default"] = FeedbackApprovalView;
  });