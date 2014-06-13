define("views/feedbackItemView", 
  ["underscore","backbone","text!templates/feedbackItemView.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";

    var template = __dependency3__;

    var FeedbackItemView = Backbone.View.extend({

    	tagName: 'li',

    	className: 'feedback-item-view',

    	template: _.template(template),

    	events: {
    		'click a.agree': 'agree',
    		'click a.agreed': 'undoAgree'
    	},

    	initialize: function(opts) {
    		this.model = opts.model;

    		this.model.on('change', this.render, this);
    		this.model.get('feedback').on('change', this.render, this);
    	},

    	render: function() {
    		var modelJSON = this.model.toJSON();

    		this.$el.html(this.template({
    			model: modelJSON
    		}));

    		this.$score = this.$('.score');

    		return this;
    	},

    	agree: function() {
    		var that = this,
    			feedback = this.model.get('feedback');

    		feedback.agree();

    		this.$score.addClass('pop');

    		setTimeout(function() {
    			that.$score.removeClass('pop');
    		}, 500);

    		return false;
    	},

    	undoAgree: function() {
    		var that = this,
    			feedback = this.model.get('feedback');

    		feedback.undoAgree();

    		this.$score.addClass('pop-reverse');

    		setTimeout(function() {
    			that.$score.removeClass('pop-reverse');
    		}, 500);

    		return false;
    	}

    });

    __exports__["default"] = FeedbackItemView;
  });