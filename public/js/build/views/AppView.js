define("views/AppView", 
  ["backbone","jquery","views/HeaderView","text!templates/AppView.html","text!templates/surveyNotification.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __exports__) {
    "use strict";
    var HeaderView = __dependency3__["default"];
    var template = __dependency4__;
    var surveyTemplate = __dependency5__;

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
    		this.$('.survey-notif').html(_.template(surveyTemplate, {
    			dueString: '3 days'	
    		}));

    		_.delay(_.bind(function() {
    			this.$('.survey-notif').addClass('show');
    		}, this), 1000);
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
    	}

    });

    __exports__["default"] = AppView;
  });