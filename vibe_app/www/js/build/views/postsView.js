define("views/postsView", 
  ["backbone","underscore","views/feedbackItemView","views/postQuestionItemView","text!templates/postsView.html","text!templates/loader.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __exports__) {
    "use strict";

    var FeedbackItemView = __dependency3__["default"];
    var PostQuestionItemView = __dependency4__["default"];

    var template = __dependency5__;
    var loaderTemplate = __dependency6__;

    var PostsView = Backbone.View.extend({

    	tagName: 'div',

    	className: 'posts-view-wrap',

    	template: _.template(template),
    	loaderTemplate: _.template(loaderTemplate),

    	events: {
    		'click a.new-posts-button': 'loadCachedPosts'
    	},

    	initialize: function(opts) {
    		var that = this;

    		if (!opts || !opts.posts) return false;

    		this.posts = opts.posts;

    		this.posts.on('reset', this.addAll, this);
    		this.posts.on('add', this.addOne, this);

    		this.posts.on('currentlyFetching', this.showLoader, this);
    		this.posts.on('fetchingDone', this.removeLoader, this);

    		this.posts.on('cachedPostsChange', this.showNewPostsButton, this);
    	},

    	render: function() {
    		this.$el.html(this.template());

    		this.$posts = this.$('ul.posts-view');
    		this.$newPostsButton = this.$('.new-posts-button');
    		this.$postsLoaderContainer = this.$('.post-loader-container');

    		this.addAll();

    		return this;
    	},

    	addAll: function() {
    		this.$posts.html('');
    		this.posts.each(this.addOne, this);
    	},

    	addOne: function(post) {
    		var itemView;

    		if (post.get('content_type') === 'feedback') {
    			itemView = new FeedbackItemView({
    				model: post
    			});
    		} else {
    			itemView = new PostQuestionItemView({
    				model: post
    			});
    		}

    		if (this.posts.indexOf(post) === 0) {
    			this.$posts.prepend(itemView.$el);
    		} else {
    			this.$posts.append(itemView.$el);
    		}
    		itemView.render();
    	},

    	showNewPostsButton: function() {
    		var numNewPosts = this.posts.cached.length;
    		if (numNewPosts) {
    			this.$newPostsButton.html('View ' + numNewPosts + ' new posts');
    			this.$newPostsButton.addClass('show');
    		} else {
    			this.$newPostsButton.removeClass('show');
    		}
    	},

    	loadCachedPosts: function() {
    		this.posts.loadCachedPosts();

    		return false;
    	},

    	showLoader: function() {
    		this.$postsLoaderContainer.html(this.loaderTemplate({ useDark: true }));
    	},

    	removeLoader: function() {
    		this.$postsLoaderContainer.html('');
    	}

    });

    __exports__["default"] = PostsView;
  });