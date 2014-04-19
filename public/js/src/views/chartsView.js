import 'backbone';
import ChartItemView from 'views/chartItemView';
module template from 'text!templates/chartsView.html';

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

export default = ChartsView;
