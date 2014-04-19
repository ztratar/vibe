import 'backbone';
module template from 'text!templates/chartsView.html';

var ChartsView = Backbone.View.extend({
	tagName: 'ul',
	className: 'charts-view',
	template: _.template(template),
	render: function() {
		this.$el.html(this.template());
		return this;
	}
});

export default = ChartsView;
