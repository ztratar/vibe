define("views/postsView", 
  ["backbone","views/feedbackItemView","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";

    var FeedbackItemView = __dependency2__["default"];

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
    		var itemView;

    		if (post.get('content_type') === 'feedback') {
    			itemView = new FeedbackItemView({
    				model: post
    			});
    		} else {
    			// Must be question
    		}

    		this.$el.append(itemView.$el);
    		itemView.render();
    	}

    });

    __exports__["default"] = PostsView;
  });