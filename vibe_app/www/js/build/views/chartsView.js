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
    		this.chartItems = [];
    		this.animated = [];

    		this.collection.on('add', this.addOne, this);
    		this.collection.on('reset', this.addAll, this);

    		$(window).on('resize', _.throttle(_.bind(this.calcTrigger, this), 20));
    	},

    	addAll: function() {
    		var that = this;

    		this.calcTrigger();

    		if (window.Vibe.appRouter.homeView.surveyTaken) {
    			this.$el.closest('.screen')
    				.off('scroll touchmove')
    				.on('scroll touchmove', _.throttle(function(ev) {
    					_.each(that.chartItems, function(chartItem) {
    						chartItem.triggerAddNewPoint(that.windowTrigger);
    					});
    				}, 20));
    		}

    		this.$el.empty();
    		this.collection.each(_.bind(this.addOne, this));
    	},

    	addOne: function(question) {
    		var chartItemView = new ChartItemView({
    			model: question	
    		});
    		this.$el.append(chartItemView.$el);
    		chartItemView.render();
    		this.chartItems.push(chartItemView);
    	},

    	calcTrigger: function() {
    		this.windowTrigger = $(window).height() * 0.65;
    	}

    });

    __exports__["default"] = ChartsView;
  });