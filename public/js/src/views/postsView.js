import 'backbone';
import 'underscore';

import FeedbackItemView from 'views/feedbackItemView';

module loaderTemplate from 'text!templates/loader.html';

var PostsView = Backbone.View.extend({

	tagName: 'ul',

	className: 'posts-view',

	loaderTemplate: _.template(loaderTemplate),

	initialize: function(opts) {
		var that = this;

		if (!opts || !opts.posts) return false;

		this.posts = opts.posts;

		this.posts.on('reset', this.addAll, this);
		this.posts.on('add', this.addOne, this);

		this.posts.on('currentlyFetching', this.showLoader, this);
		this.posts.on('fetchingDone', this.removeLoader, this);
	},

	render: function() {
		this.addAll();

		return this;
	},

	addAll: function() {
		this.$el.html('');
		this.posts.each(this.addOne, this);
	},

	addOne: function(post) {
		var itemView;

		if (post.get('content_type') === 'feedback') {
			itemView = new FeedbackItemView({
				model: post
			});
		} else {
			// Must be question
		}

		if (this.posts.indexOf(post) === 0) {
			this.$el.prepend(itemView.$el);
		} else {
			this.$el.append(itemView.$el);
		}
		itemView.render();
	},

	showLoader: function() {
		this.$el.append(
			'<li class="loader-container">' + this.loaderTemplate({ useDark: true }) + '</li>'
		);
	},

	removeLoader: function() {
		this.$('.loader-container').remove();
	}

});

export default = PostsView;
