define("views/AppView", 
  ["backbone","jquery","text!templates/AppView.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";

    var template = __dependency3__;

    var AppView = Backbone.View.extend({
    	el: 'body',
    	className: 'vibe-app',
    	render: function() {
    		this.$el.html(template);
    	}
    });

    __exports__["default"] = AppView;
  });