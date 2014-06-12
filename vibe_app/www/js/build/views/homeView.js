define("views/homeView", 
  ["backbone","models/posts","views/postsView","views/postOverlayView","views/feedbackApprovalView","text!templates/homeView.html","text!templates/newChartsLocked.html","text!templates/surveySummaryCard.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__, __dependency8__, __exports__) {
    "use strict";

    var Posts = __dependency2__["default"];
    var PostsView = __dependency3__["default"];

    var PostOverlayView = __dependency4__["default"];
    var FeedbackApprovalView = __dependency5__["default"];

    var template = __dependency6__;
    var newChartsLockedTemplate = __dependency7__;
    var surveySummaryCardTemplate = __dependency8__;

    var HomeView = Backbone.View.extend({

    	className: 'home-view',

    	template: _.template(template),

    	events: {
    		'click a.new-post': 'newPost'
    	},

    	initialize: function() {
    		this.posts = new Posts();
    		this.postsView = new PostsView({
    			posts: this.posts
    		});
    	},

    	render: function() {
    		this.$el.html(this.template({
    			user: window.Vibe.user.toJSON()
    		}));

    		this.$newPostButton = this.$('a.new-post');
    		this.$feedbackApproval = this.$('.feedback-approval-container');
    		this.$postsContainer = this.$('.posts-container');

    		this.renderFeedbackApproval();
    		this.$postsContainer.html(this.postsView.$el);
    		this.postsView.render();

    		return this;
    	},

    	renderFeedbackApproval: function() {
    		if (window.Vibe.user.get('isAdmin')) {
    			var feedbackApprovalView = new FeedbackApprovalView();
    			this.$feedbackApproval.html(feedbackApprovalView.$el);
    			feedbackApprovalView.render();
    		}
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

    __exports__["default"] = HomeView;
  });