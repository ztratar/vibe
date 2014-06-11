define("views/postOverlayView", 
  ["backbone","text!templates/postOverlayView.html","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";

    var template = __dependency2__;

    var PostOverlayView = Backbone.View.extend({

    	className: 'post-overlay-view',

    	template: _.template(template),

    	MAX_TEXT_LENGTH: 240,

    	events: {
    		'keydown textarea': 'changeLengthMarker',
    		'keyup textarea': 'changeLengthMarker',
    		'click .v-centered': 'clickedModal'
    	},

    	render: function() {
    		var that = this;

    		window.Vibe.appRouter.screenRouter.disableScreenScroll();
    		window.Vibe.appView.headerView.setButtons({
    			title: '',
    			rightAction: {
    				title: 'Post',
    				click: function(ev) {
    					return false;
    				}
    			},
    			leftAction: {
    				title: 'Cancel',
    				click: function(ev) {
    					that.remove();
    					return false;
    				}
    			}
    		});
    		window.Vibe.appView.headerView.animateToNewComponents('slideDown');

    		this.$el.html(this.template({
    			maxTextLength: this.MAX_TEXT_LENGTH
    		}));

    		this.$textarea = this.$('textarea');
    		this.$lengthMarker = this.$('.length-marker');

    		return this;
    	},

    	animateIn: function() {
    		_.defer(_.bind(function() {
    			this.$el.addClass('expand');
    			_.delay(_.bind(function() {
    				this.$textarea.focus();
    			}, this), 200);
    		}, this));
    	},

    	changeLengthMarker: function(ev) {
    		var inputVal = this.$textarea.val(),
    			markerText = inputVal.length + '/' + this.MAX_TEXT_LENGTH;

    		if (ev.keyCode === 91 || ev.keyCode === 17) {
    			if (ev.type === 'keydown') {
    				this.ctrlCommandDown = true;
    			} else if (ev.type === 'keyup') {
    				this.ctrlCommandDown = false;
    			}
    		}

    		if (ev.keyCode === 65 && this.ctrlCommandDown) {
    			return true;
    		}

    		if (inputVal.length > this.MAX_TEXT_LENGTH
    				&& ev.keyCode !== 8) {
    			return false;
    		}

    		this.$lengthMarker.html(markerText);
    	},

    	clickedModal: function(ev) {
    		if ($(ev.target).hasClass('input-center')) {
    			this.$textarea.focus();
    			return false;
    		}
    	},

    	remove: function() {
    		window.Vibe.appRouter.screenRouter.enableScreenScroll();
    		window.Vibe.appView.headerView.setButtons({
    			title: 'vibe',
    			rightAction: {
    				title: '',
    				icon: '#61886',
    				click: function(ev) {
    					var $target = $(ev.target);
    					window.Vibe.appRouter.navigateWithAnimation('settings', 'pushLeft', {
    						trigger: true
    					});
    					return false;
    				}
    			}
    		});
    		window.Vibe.appView.headerView.animateToNewComponents('slideDown');

    		this.trigger('remove');
    		this.$el.addClass('remove');
    		_.delay(_.bind(function() {
    			this.$el.remove();
    		}, this), 280);
    	}

    });

    __exports__["default"] = PostOverlayView;
  });