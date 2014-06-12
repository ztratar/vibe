define("views/feedbackApprovalItemView", 
  ["backbone","moment","text!templates/feedbackApprovalItemView.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var moment = __dependency2__;

    var template = __dependency3__;

    var FeedbackApprovalItemView = Backbone.View.extend({

    	tagName: 'li',

    	template: _.template(template),

    	initialize: function(opts) {
    		this.model = opts.model;
    		this.feedbacks = opts.feedbacks;
    		this.model.on('change', this.render, this);
    	},

    	render: function() {
    		if (this.model.get('status') !== 'pending') {
    			this.feedbacks.remove(this.model);
    		} else {
    			this.$el.html(this.template({
    				model: this.model.toJSON(),
    				time_created: moment(this.model.get('time_created')).fromNow()
    			}));
    		}
    		return this;
    	},

    	approve: function() {
    		this.model.approve();
    		return false;
    	},

    	reject: function() {
    		this.model.reject();
    		return false;
    	}

    });

    __exports__["default"] = FeedbackApprovalItemView;
  });