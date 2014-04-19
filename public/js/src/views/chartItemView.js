import 'backbone';
module template from 'text!templates/chartItemView.html';

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

export default = ChartItemView;
