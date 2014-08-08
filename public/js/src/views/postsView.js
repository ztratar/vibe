import 'backbone';
import 'underscore';

import FeedbackItemView from 'views/feedbackItemView';
import PostQuestionItemView from 'views/postQuestionItemView';

module template from 'text!templates/postsView.html';
module loaderTemplate from 'text!templates/loader.html';
module postsEmptyTemplate from 'text!templates/postsViewEmpty.html';

var PostsView = Backbone.View.extend({

	tagName: 'div',

	className: 'posts-view-wrap',

	template: _.template(template),
	loaderTemplate: _.template(loaderTemplate),
	emptyTemplate: _.template(postsEmptyTemplate),

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

		this.$posts = this.$('.posts-view');
		this.$newPostsButton = this.$('.new-posts-button');
		this.$postsLoaderContainer = this.$('.posts-loader-container');

		if (!this.posts.length) {
			this.showLoader();
		}

		this.addAll();

		return this;
	},

	addAll: function(ev) {
		if (this.posts.length) {
			this.removeLoader();
			this.$posts.html('');
			this.posts.each(this.addOne, this);
		} else if (ev) {
			this.removeLoader();
			this.isEmpty = true;
			this.$posts.html(this.emptyTemplate());
		}
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

		if (this.isEmpty) {
			this.isEmpty = false;
			this.$posts.html('');
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
			this.$newPostsButton.html('View ' + numNewPosts + ' new updates');
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

export default = PostsView;
