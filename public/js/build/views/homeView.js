define("views/homeView", 
  ["backbone","views/chartsView","text!templates/homeView.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var ChartsView = __dependency2__["default"];
    var template = __dependency3__;

    var HomeView = Backbone.View.extend({
    	className: 'home-view',
    	template: _.template(template),
    	initialize: function() {
    		this.chartsView = new ChartsView();	
    	},
    	render: function() {
    		this.$el.html(this.template({
    			user: window.Vibe.user.toJSON()	
    		}));
    		this.$('.charts-container').html(this.chartsView.$el);
    		this.chartsView.render();
    		return this;
    	}
    });

    __exports__["default"] = HomeView;
  });