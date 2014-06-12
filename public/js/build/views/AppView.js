define("views/AppView", 
  ["backbone","jquery","models/survey","views/headerView","text!templates/AppView.html","text!templates/surveyNotification.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __exports__) {
    "use strict";
    var Survey = __dependency3__["default"];
    var HeaderView = __dependency4__["default"];
    var template = __dependency5__;
    var surveyTemplate = __dependency6__;

    var AppView = Backbone.View.extend({

    	el: 'body',

    	className: 'vibe-app app-view',

    	initialize: function() {
    		this.headerView = new HeaderView();
    		this.overrideLinks();
    	},

    	render: function() {
    		this.$el.html(template);
    		this.$('.app-header').html(this.headerView.$el);

    		this.$notifHolder = this.$('.notif-holder');
    		this.$notifText = this.$('.notif-text');
    	},

    	overrideLinks: function() {
    		this.$el.on('click', 'a', function(ev) {
    			var $target = $(ev.target),
    				href= $target.attr('href'),
    				animation = $target.attr('data-animation');

    			if (!$target.hasClass('no-override') && href && href.charAt(0) === '/') {
    				window.Vibe.appRouter.navigateWithAnimation(href, animation, {
    					trigger: true
    				});
    				return false;
    			}
    		});
    	},

    	showNotif: function(text, timeToRead, addClass) {
    		var that = this;

    		timeToRead = timeToRead || 2100;
    		addClass = addClass || '';

    		this.$notifText.html(text);

    		this.$notifHolder
    			.addClass('with-anim')
    			.addClass('show-notif');

    		if (addClass) {
    			this.$notifHolder.addClass(addClass);
    		}

    		_.delay(function() {
    			that.$notifHolder.removeClass('with-anim');
    		}, 500);

    		_.delay(function() {
    			that.$notifHolder.removeClass('show-notif');
    			if (addClass) {
    				_.delay(function() {
    					that.$notifHolder.removeClass(addClass);
    				}, 420);
    			}
    		}, timeToRead);
    	}

    });

    __exports__["default"] = AppView;
  });