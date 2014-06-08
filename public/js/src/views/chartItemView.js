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
		chartMargin: 40,
		chartBottomMargin: 24,
		maxRating: 4
	},

	events: {
		'click a.discuss': 'discuss'
	},

	render: function(hey) {
		this.$el.html(this.template(this.model.toJSON()));
		this.drawChart();

		return this;
	},

	initChart: function() {
		var $chart = this.$('.chart');

		this.points = [];
		this.lines = [];
		this.circles = [];
		this.axis = [];
		this.numPoints = 0;
		this.chartHeight = $chart.height(),
		this.$('.chart').empty();

		this.svg = d3.select(this.$('.chart')[0])
			.append("svg")
			.attr("height", this.chartHeight);
	},

	drawChart: function() {
		var answerData = this.model.get('answer_data'),
			answerKeys = Object.keys(answerData);

		this.initChart();

		this.drawAxisGradient();

		for (var i = answerKeys.length-1; i >= 0; i--) {
			this.addPoint(answerData[i]);
		}
		this.renderAxisText();

		this.$('.chart-scroller').scrollLeft(this.currentWidth);
	},

	addPoint: function(pointData, animate) {
		var point1 = this.getPoint(this.numPoints),
			point2 = this.getPoint(this.numPoints + 1, pointData);

		this.numPoints++;
		this.currentWidth = (Math.max(this.numPoints-1, 0) * this.chartSettings.timeIntervalWidth) + 2*this.chartSettings.chartMargin;

		if (!animate) {
			// Change chart width
			this.svg
				.attr("width", this.currentWidth);

			// Draw Objects
			if (point1) {
				this.drawLine(this.numPoints, point1, point2);
				this.drawCircle(this.numPoints-1, point1.x, point1.y);
			}
			this.drawAxisMarker(this.numPoints, point2.x);
			this.drawCircle(this.numPoints, point2.x, point2.y);
		} else {
			this.svg.transition()
				.attr('width', this.currentWidth)
				.duration(400);

			this.$('.chart-scroller').animate({
				scrollLeft: this.currentWidth
			}, 400);

			this.drawAxisMarker(this.numPoints, point2.x);

			var line = this.drawLine(this.numPoints, point1, point2, 400),
				circle = this.drawCircle(this.numPoints, point2.x, point2.y, 3);

			this.drawCircle(this.numPoints-1, point1.x, point1.y);

			line.attr('class', 'new anim');
			circle.attr('class', 'new anim');

			circle.transition()
				.attr('r', 12)
				.duration(400)
				.delay(240)
				.transition()
				.attr('r', 10)
				.duration(130);

			_.delay(function() {
				circle.attr('class', 'anim');
				line.attr('class', 'anim');
			}, 600);
		}
	},

	getPoint: function(i, answerItem) {
		var chartWidth = this.currentWidth,
			topMargin = 10,
			realChartHeight,
			yPercentage;

		if (typeof answerItem !== 'number' && typeof this.points[i] !== 'number') {
			return false;
		}

		if (typeof answerItem === 'number') {
			this.points[i] = answerItem;
		} else {
			answerItem = this.points[i];
		}

		realChartHeight = this.chartHeight - this.chartSettings.chartBottomMargin - 10 - topMargin,
		yPercentage = (answerItem/this.chartSettings.maxRating);

		return {
			x: (i-1)*this.chartSettings.timeIntervalWidth + this.chartSettings.chartMargin,
			y: topMargin + (realChartHeight * (1 - yPercentage))
		};
	},

	drawLine: function(i, point1, point2, animationDuration) {
		var line = this.svg.append('line')
				.attr('x1', point1.x)
				.attr('y1', point1.y);

		if (!animationDuration) {
			line.attr('x2', point2.x)
				.attr('y2', point2.y);
		} else {
			line.attr('x2', point1.x)
				.attr('y2', point1.y)
				.transition()
				.attr('x2', point2.x)
				.attr('y2', point2.y)
				.duration(animationDuration);
		}

		this.lines[i] = line;

		return line;
	},

	drawCircle: function(i, x, y, r) {
		r = r || 10;
		var circle = this.svg.append('circle')
			.attr('cx', x)
			.attr('cy', y)
			.attr('r', r);

		this.circles[i] = circle;

		return circle;
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

	getAxisText: function(i) {
		var text,
			pos = this.numPoints - i;

		text = (pos === 0) ? 'NOW' : pos + ' WKS';
		text = (pos === 1) ? '1 WK' : text;

		return text;
	},

	drawAxisMarker: function(i, x) {
		var axis = this.svg.append('g'),
			text = this.getAxisText(i);

		axis.append('line')
			.attr('class', 'axis')
			.attr('x1', x)
			.attr('y1', 0)
			.attr('x2', x)
			.attr('y2', this.chartHeight - this.chartSettings.chartBottomMargin);

		axis.append('text')
			.attr("text-anchor", "middle")
			.attr('x', x)
			.attr('y', this.chartHeight)
			.text('');

		this.axis[i] = axis;
	},

	renderAxisText: function() {
		var i;

		for (i = 1; i <= this.numPoints; i++) {
			this.axis[i].select('text').text(this.getAxisText(i));
		}
	},

	triggerAddNewPoint: function(trigPos) {
		if (this.newPointAlreadyAdded) {
			return false;
		}
		
		var chartPos = this.$el.position().top;

		if (chartPos < trigPos) {
			this.newPointAlreadyAdded = true;
			this.addPoint(2+2*Math.random(), true);
			this.renderAxisText();
		}
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
