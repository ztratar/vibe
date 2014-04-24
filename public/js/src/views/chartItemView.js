import 'backbone';
import 'underscore';

module d3 from 'd3';
module template from 'text!templates/chartItemView.html';

var ChartItemView = Backbone.View.extend({
	tagName: 'li',
	className: 'chart-item',
	template: _.template(template),
	chartSettings: {
		timeIntervalWidth: 68,
		chartMargin: 15,
		chartBottomMargin: 24,
		maxRating: 4
	},
	events: {
		'click a.discuss': 'discuss'
	},
	initialize: function() {
		this.model.on('change', this.render);
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		this.drawChart();

		return this;
	},
	drawChart: function() {
		var $chart = this.$('.chart'),
			answerData = this.model.get('answerData'),
			numTimeIntervals = Object.keys(answerData).length,
			chartHeight = $chart.height(),
			topMargin = 10,
			chartWidth = (numTimeIntervals) * this.chartSettings.timeIntervalWidth;

		this.svg = d3.select(this.$('.chart')[0]).append("svg")
				.attr("width", chartWidth + 2*this.chartSettings.chartMargin)
				.attr("height", chartHeight);

		this.chartHeight = chartHeight - this.chartSettings.chartBottomMargin;

		this.drawAxisGradient();

		for (var i = 0; i < numTimeIntervals-1; i++) {
			var point1 = {
					x: chartWidth - (i*this.chartSettings.timeIntervalWidth) - this.chartSettings.chartMargin,
					y: topMargin + this.chartHeight * (1 - (answerData[i]/this.chartSettings.maxRating))
				},
				point2 = {
					x: chartWidth - ((i+1)*this.chartSettings.timeIntervalWidth) - this.chartSettings.chartMargin,
					y: topMargin + this.chartHeight * (1 - (answerData[i+1]/this.chartSettings.maxRating))
				};

			this.drawLine(point1, point2);
			this.drawAxisMarker(i, point1.x);
			this.drawCircle(point1.x, point1.y);

			if (i === numTimeIntervals-2) {
				this.drawAxisMarker(i+1, point2.x);
				this.drawCircle(point2.x, point2.y);
			}
		};

		this.$('.chart-scroller').scrollLeft(chartWidth);
	},
	drawLine: function(point1, point2) {
		this.svg.append('line')
			.attr('x1', point1.x)
			.attr('y1', point1.y)
			.attr('x2', point2.x)
			.attr('y2', point2.y);
	},
	drawCircle: function(x, y) {
		this.svg.append('circle')
			.attr('cx', x)
			.attr('cy', y)
			.attr('r', 10);
	},
	drawAxisGradient: function() {
		this.svg.append('linearGradient')
			.attr('id', 'axis-gradient')
			.attr('gradientUnits', 'userSpaceOnUse')
			.attr('x1', 0).attr('y1', 0)
			.attr('x2', 0).attr('y1', this.chartHeight)
			.selectAll('stop')
			.data([
				{ offset: '0%', color: 'white' },
				{ offset: '70%', color: 'white' },
				{ offset: '100%', color: 'rgba(255, 255, 255, 0)' }
			])
			.enter()
			.append('stop')
			.attr('offset', function(d) { return d.offset; })
			.attr('stop-color', function(d) { return d.color; });
	},
	drawAxisMarker: function(i, x) {
		var axis = this.svg.append('g'),
			text;

		text = (i === 0) ? 'NOW' : i + ' WKS';
		text = (i === 1) ? '1 WK' : text;

		axis.append('line')
			.attr('class', 'axis')
			.attr('x1', x)
			.attr('y1', 0)
			.attr('x2', x)
			.attr('y2', this.chartHeight - 6);

		axis.append('text')
			.attr("text-anchor", "middle")
			.attr('x', x)
			.attr('y', this.chartHeight + 20)
			.text(text);
	},
	discuss: function() {
		window.Vibe.modelCache.set('question-' + this.model.get('id'), this.model.toJSON());
		window.Vibe.appRouter.navigateWithAnimation(
			'discuss/' + this.model.get('id'),
			'pushLeft',
			{
				trigger: true	
			}	
		);
		return false;
	}
});

export default = ChartItemView;
