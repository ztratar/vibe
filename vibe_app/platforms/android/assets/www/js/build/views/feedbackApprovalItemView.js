define("views/feedbackApprovalItemView", 
  ["backbone","moment","views/confirmDialogView","text!templates/feedbackApprovalItemView.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var moment = __dependency2__;

    var ConfirmDialogView = __dependency3__["default"];

    var template = __dependency4__;

    var FeedbackApprovalItemView = Backbone.View.extend({

    	tagName: 'li',

    	template: _.template(template),

    	events: {
    		'click a.approve': 'approve',
    		'click a.disapprove': 'reject'
    	},

    	initialize: function(opts) {
    		this.model = opts.model;
    		this.feedbacks = opts.feedbacks;
    		this.model.on('change', this.render, this);
    	},

    	render: function() {
    		if (this.model.get('status') !== 'pending') {
    			this.feedbacks.remove(this.model);
    			this.remove();
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
    		var that = this,
    			confirmDialog = new ConfirmDialogView({
    				title: 'Please give a reason',
    				body: 'We will forward it on!',
    				textarea: true,
    				onConfirm: function(reasonVal) {
    					that.model.reject(reasonVal);
    				}
    			});

    		window.Vibe.appView.showOverlay(confirmDialog);

    		return false;
    	}

    });

    __exports__["default"] = FeedbackApprovalItemView;
  });