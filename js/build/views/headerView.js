define("views/HeaderView", 
  ["backbone","jquery","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";

    var HeaderView = Backbone.View.extend({
    	className: 'header-view',
    	render: function() {
    		this.$el.html('header');
    	}
    });

    __exports__["default"] = HeaderView;
  });