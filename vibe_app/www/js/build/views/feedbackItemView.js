define("views/feedbackItemView", 
  ["underscore","backbone","text!templates/feedbackItemView.html","text!templates/votingBarTemplate.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";

    var template = __dependency3__;
    var votingBarTemplate = __dependency4__;

    var FeedbackItemView = Backbone.View.extend({

    	tagName: 'li',

    	className: 'feedback-item-view',

    	template: _.template(template),
    	votingBarTemplate: _.template(votingBarTemplate),

    	initialize: function(opts) {
    		this.model = opts.model;
    		this.model.on('change', this.render, this);
    	},

    	render: function() {
    		var modelJSON = this.model.toJSON();

    		this.$el.html(this.template({
    			model: modelJSON
    		}));

    		this.$('.voting-bar-container').html(this.votingBarTemplate({
    			model: modelJSON
    		}));
    		return this;
    	}

    });

    __exports__["default"] = FeedbackItemView;
  });