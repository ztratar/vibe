define("views/chartsView", 
  ["backbone","text!templates/chartsView.html","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var template = __dependency2__;

    var ChartsView = Backbone.View.extend({
    	tagName: 'ul',
    	className: 'charts-view',
    	template: _.template(template),
    	render: function() {
    		this.$el.html(this.template());
    		return this;
    	}
    });

    __exports__["default"] = ChartsView;
  });