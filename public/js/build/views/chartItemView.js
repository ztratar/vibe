define("views/chartItemView", 
  ["backbone","text!templates/chartItemView.html","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var template = __dependency2__;

    var ChartItemView = Backbone.View.extend({
    	tagName: 'li',
    	className: 'chart-item',
    	template: _.template(template),
    	initialize: function() {
    		this.model.on('change', this.render);
    	},
    	render: function() {
    		this.$el.html(this.template(this.model.toJSON()));
    		return this;
    	}
    });

    __exports__["default"] = ChartItemView;
  });