define("views/chartsView", 
  ["backbone","views/chartItemView","text!templates/chartsView.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var ChartItemView = __dependency2__["default"];
    var template = __dependency3__;

    var ChartsView = Backbone.View.extend({
    	tagName: 'ul',
    	className: 'charts-view',
    	template: _.template(template),
    	initialize: function() {
    		this.collection.on('add', this.addOne, this);
    		this.collection.on('reset', this.addAll);
    	},
    	addAll: function() {
    		this.$el.empty();
    		this.collection.each(this.addOne);
    	},
    	addOne: function(question) {
    		var chartItemView = new ChartItemView({
    			model: question	
    		});
    		this.$el.append(chartItemView.$el);
    		chartItemView.render();
    	}
    });

    __exports__["default"] = ChartsView;
  });