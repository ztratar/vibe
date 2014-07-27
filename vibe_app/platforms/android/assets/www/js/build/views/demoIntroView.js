define("views/demoIntroView", 
  ["backbone","text!templates/demoIntroView.html","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";

    var template = __dependency2__;

    var DemoIntroView = Backbone.View.extend({

    	className: 'demo-intro-view',

    	template: _.template(template),

    	events: {
    		'click a.confirm': 'confirm'
    	},

    	render: function() {
    		this.paneNum = 1;

    		this.$el.html(this.template());
    	},

    	confirm: function() {
    		this.paneNum++;

    		if (this.paneNum === 5) {
    			this.remove();
    		}

    		this.$('.demo-pane.active')
    			.addClass('done')
    			.next()
    			.addClass('active');

    		if (this.paneNum === 4) {
    			this.$('a.btn.confirm')
    				.html('Let me in!');
    		}

    		return false;
    	},

    	remove: function() {
    		this.trigger('remove');
    		this.$el.remove();
    	}

    });

    __exports__["default"] = DemoIntroView;
  });