define("views/discussView", 
  ["backbone","models/comments","views/commentView","text!templates/discussView.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Comments = __dependency2__["default"];
    var CommentView = __dependency3__["default"];

    var template = __dependency4__;

    var DiscussView = Backbone.View.extend({

    	className: 'discuss-view',

    	template: _.template(template),

    	events: {
    		'keydown input': 'addComment'
    	},

    	initialize: function() {
    		this.comments = new Comments([{
    			text: 'sup'
    		},{
    			text: 'hey man'
    		}]);
    		this.comments.on('add', this.addOne, this);
    		this.comments.on('reset', this.addAll, this);
    	},

    	render: function() {
    		this.$el.html(this.template());
    		this.$textInput = this.$('input');
    		this.$commentsContainer = this.$('.comments');
    		this.addAll();
    		return this;
    	},

    	addComment: function(ev) {
    		if (ev && ev.keyCode === 32) {
    			var commentText = this.$textInput.val(),
    				comment;	

    			if (commentText) {
    				this.$textInput.val('');	
    				comment = new Comment({
    					text: commentText
    				});
    				this.comments.add(comment);
    			}

    			ev.preventDefault();
    			ev.stopPropagation();
    			return false;
    		}
    	},

    	addOne: function(comment) {
    		var commentView = new CommentView({
    			model: comment
    		});	
    		this.$commentsContainer.append(commentView.$el);
    		commentView.render();
    	},

    	addAll: function() {
    		this.$commentsContainer.empty();
    		this.comments.each(_.bind(this.addOne, this));
    	}

    });

    __exports__["default"] = DiscussView;
  });