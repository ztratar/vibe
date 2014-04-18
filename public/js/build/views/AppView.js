define("views/AppView", 
  ["backbone","jquery","views/HeaderView","text!templates/AppView.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";

    var HeaderView = __dependency3__["default"];

    var template = __dependency4__;

    var AppView = Backbone.View.extend({

    	el: 'body',

    	className: 'vibe-app app-view',

    	initialize: function() {
    		this.headerView = new HeaderView();
    	},

    	render: function() {
    		this.$el.html(template);
    		this.$('.app-header').html(this.headerView.$el);
    		this.headerView.render();
    	}

    });

    __exports__["default"] = AppView;
  });