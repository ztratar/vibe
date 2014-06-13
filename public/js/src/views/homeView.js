import 'backbone';

import Posts from 'models/posts';
import PostsView from 'views/postsView';

import PostOverlayView from 'views/postOverlayView';
import FeedbackApprovalView from 'views/feedbackApprovalView';

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

		this.infScrollHandler();

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
	},

	infScrollHandler: function() {
		var that = this,
			$currentScreen = $(window.Vibe.appRouter.screenRouter.currentScreen),
			currentScreenHeight = $currentScreen.height(),
			verticalOffset = 300;

		$currentScreen
			.off('scroll.postsInfScroll')
			.on('scroll.postsInfScroll', _.throttle(function() {
				var targetScroll = $currentScreen[0].scrollHeight - currentScreenHeight - verticalOffset,
					currentScroll = $currentScreen.scrollTop();

				if (currentScroll >= targetScroll
						&& !that.posts.currentlyFetching
						&& !that.posts.atLastItem) {
					that.posts.getMore();
				}
			}, 16));
	}

});

export default = HomeView;
