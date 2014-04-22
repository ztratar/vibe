define("views/welcomeView", 
  ["backbone","text!templates/welcomeView.html","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var template = __dependency2__;

    var WelcomeView = Backbone.View.extend({
    	template: _.template(template),
    	render: function() {
    		this.$el.html(this.template());
    		return this;
    	}
    });

    __exports__["default"] = WelcomeView;
  });