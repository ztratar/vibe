define("views/confirmDialogView", 
  ["backbone","text!templates/confirmDialogView.html","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";

    var template = __dependency2__;

    var ConfirmDialogView = Backbone.View.extend({

    	className: 'confirm-dialog-view',

    	template: _.template(template),

    	events: {
    		'click a.cancel': 'cancel',
    		'click a.confirm': 'confirm'
    	},

    	initialize: function(opts) {
    		_.extend(this, {
    			title: '',
    			body: '',
    			confirmText: 'Confirm',
    			cancelText: 'Cancel',
    			onConfirm: function() {},
    			onCancel: function() {}
    		}, opts);
    	},

    	render: function() {
    		this.$el.html(this.template({
    			title: this.title,
    			body: this.body,
    			cancelText: this.cancelText,
    			confirmText: this.confirmText
    		}));
    	},

    	cancel: function() {
    		this.onCancel();
    		this.remove();
    		return false;
    	},

    	confirm: function() {
    		this.onConfirm();
    		this.remove();
    		return false;
    	},

    	remove: function() {
    		this.trigger('remove');
    		this.$el.remove();
    	}

    });

    __exports__["default"] = ConfirmDialogView;
  });