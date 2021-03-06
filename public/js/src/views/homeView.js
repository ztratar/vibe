import 'backbone';

import BaseView from 'views/baseView';
import Posts from 'models/posts';
import PostsView from 'views/postsView';
import PostOverlayView from 'views/postOverlayView';
import FeedbackApprovalView from 'views/feedbackApprovalView';
import ManagePollsView from 'views/managePollsView';
import Analytics from 'helpers/analytics';

module template from 'text!templates/homeView.html';
module newChartsLockedTemplate from 'text!templates/newChartsLocked.html';
module surveySummaryCardTemplate from 'text!templates/surveySummaryCard.html';

var HomeView = BaseView.extend({

	className: 'home-view',

	template: _.template(template),

	events: {
		'tap a.new-post': 'newPost',
		'tap a.manage-polls': 'managePolls'
	},

	initialize: function() {
		this.posts = new Posts();
		this.postsView = new PostsView({
			posts: this.posts
		});
	},

	render: function() {
		this.$el.html(this.template({
			user: window.Vibe.user.toJSON(),
			company: window.Vibe.user.get('company')
		}));

		this.$newPostButton = this.$('a.new-post');
		this.$feedbackApproval = this.$('.feedback-approval-container');
		this.$postsContainer = this.$('.posts-container');

		this.renderFeedbackApproval();
		this.$postsContainer.html(this.postsView.$el);
		this.postsView.render();

		this.infScrollHandler();

		this.delegateEvents();

		return this;
	},

	renderFeedbackApproval: function() {
		if (window.Vibe.user.get('isAdmin')) {
			this.feedbackApprovalView = new FeedbackApprovalView();
			this.$feedbackApproval.html(this.feedbackApprovalView.$el);
			this.feedbackApprovalView.render();
		}
	},

	newPost: function() {
		var postOverlayView = new PostOverlayView();

		this.$newPostButton.addClass('fadeOut');

		window.Vibe.appView.showOverlay(postOverlayView, {
			showTopBar: true,
			noAnimation: window.isCordova,
			afterRender: function() {
				if (window.isCordova) {
					postOverlayView.$textarea.focus();
				}
			},
			afterAnimate: function() {
				postOverlayView.positionModal();
				_.delay(function() {
					postOverlayView.$textarea.focus();
					_.delay(function() {
						postOverlayView.$textarea.focus();
					}, 230);
				}, 230);
			}
		});

		postOverlayView.on('remove', _.bind(function() {
			this.$newPostButton.removeClass('fadeOut');
		}, this));

		Analytics.log({
			eventCategory: 'post',
			eventAction: 'clicked-post-button'
		});

		return false;
	},

	managePolls: function() {
		var managePollsView = new ManagePollsView();

		managePollsView.$el.addClass('as-modal');
		window.Vibe.appView.showOverlay(managePollsView);

		if (window.isCordova) {
			window.Vibe.appRouter.screenRouter.currentScreen.hide();
			managePollsView.on('remove', function() {
				window.Vibe.appRouter.screenRouter.currentScreen.show();
			});
		}

		return false;
	},

	infScrollHandler: function() {
		var that = this,
			$currentScreen = $(window.Vibe.appRouter.screenRouter.currentScreen),
			currentScreenHeight = $currentScreen.height(),
			verticalOffset = 300;

		$currentScreen
			.off('scroll.postsInfScroll touchmove.postsInfScroll')
			.on('scroll.postsInfScroll touchmove.postsInfScroll', _.throttle(function() {
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
