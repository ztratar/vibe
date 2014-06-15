define("views/postQuestionItemView", 
  ["backbone","underscore","text!templates/postQuestionItemView.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";

    var template = __dependency3__;

    var PostQuestionItemView = Backbone.View.extend({

    	tagName: 'li',

    	className: 'post-question-item-view',

    	template: _.template(template),

    	initialize: function(opts) {
    		this.model = opts.model;
    	},

    	render: function() {
    		this.$el.html(this.template({
    			model: this.model.toJSON()
    		}));
    	}

    });

    __exports__["default"] = PostQuestionItemView;
  });