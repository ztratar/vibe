define("views/commentView", 
  ["backbone","text!templates/commentView.html","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var template = __dependency2__;

    var CommentView = Backbone.View.extend({

    	template: _.template(template),

    	tagName: 'li',

    	className: 'comment-view',

    	initialize: function() {
    		this.model.on('change', this.render, this);
    	},

    	render: function() {
    		this.$el.html(this.template(this.model.toJSON()));
    		return this;
    	}

    });

    __exports__["default"] = CommentView;
  });