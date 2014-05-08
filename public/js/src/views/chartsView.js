import 'backbone';
import ChartItemView from 'views/chartItemView';
module template from 'text!templates/chartsView.html';

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

export default = ChartsView;
