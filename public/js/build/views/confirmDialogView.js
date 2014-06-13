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
    			textarea: false,
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
    			textarea: this.textarea,
    			cancelText: this.cancelText,
    			confirmText: this.confirmText
    		}));

    		this.$textarea = this.$('textarea');

    		if (this.$textarea) {
    			_.delay(_.bind(function() {
    				this.$textarea.focus();
    			}, this), 200);
    		}
    	},

    	cancel: function() {
    		this.onCancel();
    		this.remove();
    		return false;
    	},

    	confirm: function() {
    		var textVal = this.$textarea ? this.$textarea.val() : undefined;

    		this.onConfirm(textVal);
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