define("views/HeaderView", 
  ["backbone","jquery","underscore","text!templates/HeaderView.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";

    var template = __dependency4__;

    var HeaderView = Backbone.View.extend({

    	className: 'header-view',

    	initialize: function(opts) {
    		this.data = {
    			title: 'vibe',
    			leftAction: undefined,
    			rightAction: undefined
    		};

    		this.data.leftAction = {
    			title: 'back'
    		}
    	},

    	render: function() {
    		this.$el.html(_.template(template, this.data));
    	}

    });

    __exports__["default"] = HeaderView;
  });