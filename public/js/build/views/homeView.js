define("views/homeView", 
  ["backbone","models/posts","views/postsView","views/postOverlayView","views/feedbackApprovalView","views/managePollsView","text!templates/homeView.html","text!templates/newChartsLocked.html","text!templates/surveySummaryCard.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__, __dependency8__, __dependency9__, __exports__) {
    "use strict";

    var Posts = __dependency2__["default"];
    var PostsView = __dependency3__["default"];

    var PostOverlayView = __dependency4__["default"];
    var FeedbackApprovalView = __dependency5__["default"];

    var ManagePollsView = __dependency6__["default"];

    var template = __dependency7__;
    var newChartsLockedTemplate = __dependency8__;
    var surveySummaryCardTemplate = __dependency9__;

    var HomeView = Backbone.View.extend({

    	className: 'home-view',

    	template: _.template(template),

    	events: {
    		'click a.new-post': 'newPost',
    		'click a.manage-polls': 'managePolls'
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

    		this.$newPostButton.addClass('fadeOut');

    		window.Vibe.appView.showOverlay(postOverlayView, {
    			showTopBar: true,
    			afterAnimate: function() {
    				_.delay(function() {
    					postOverlayView.$textarea.focus();
    				}, 230);
    			}
    		});

    		postOverlayView.on('remove', _.bind(function() {
    			this.$newPostButton.removeClass('fadeOut');
    		}, this));

    		return false;
    	},

    	managePolls: function() {
    		var managePollsView = new ManagePollsView();

    		managePollsView.$el.addClass('as-modal');
    		window.Vibe.appView.showOverlay(managePollsView);

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

    __exports__["default"] = HomeView;
  });