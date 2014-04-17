define("views/headerView", 
  ["backbone","jquery","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    // headerView.js
    // 
    // Future home of the header view


    var HeaderView = Backbone.View.extend({
    	className: 'test',
    	render: function() {
    		this.$el.html('i am a test');
    	}
    });

    __exports__["default"] = HeaderView;
  });