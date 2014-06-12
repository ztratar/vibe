import 'backbone';

import PostItemView from 'views/postItemView';

var PostsView = Backbone.View.extend({

	tagName: 'ul',

	className: 'posts-view',

	initialize: function(opts) {
		if (!opts || !opts.posts) return false;

		this.posts = opts.posts;

		this.posts.on('reset', this.addAll, this);
		this.posts.on('add', this.addOne, this);
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
		var postItemView = new PostItemView({
				model: post
			});

		this.$el.append(postItemView.$el);
		postItemView.render();
	}

});

export default = PostsView;
