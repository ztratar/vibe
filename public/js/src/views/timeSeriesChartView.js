import 'backbone';
import 'underscore';

module moment from 'moment';
module d3 from 'd3';

var TimeSeriesChartView = Backbone.View.extend({

	className: 'time-series-chart-view',

	chartSettings: {
		chartMargin: 80,
		chartBottomMargin: 24,
		maxRating: 4
	},

	initialize: function(opts) {
		this.model = opts.model;
	},

	render: function() {
		this.answerData = this.model.get('answer_data');

		if (this.answerData.length > 1) {
			this.initChart();
			this.drawAxisGradient();
			for (var i = 0; i < this.answerData.length; i++) {
				this.addPoint(this.answerData[i]);
			}
			this.renderAxisText();
		}
	},

	initChart: function() {
		var $chart = this.$el;

		// Store time variables used for x position calculations
		this.mostRecentTime = Date.parse(_.last(this.answerData).time_sent),
		this.oldestTime = Date.parse(this.answerData[0].time_sent);
		this.totalGraphTimeDiff = this.mostRecentTime - this.oldestTime;

		this.points = [];
		this.lines = [];
		this.circles = [];
		this.axis = [];
		this.numPoints = 0;
		this.chartHeight = $chart.height();
		this.chartWidth = $chart.width();
		$chart.empty();

		this.svg = d3.select($chart[0])
			.append("svg")
			.attr("height", this.chartHeight)
			.attr("width", this.chartWidth);
	},

	addPoint: function(pointData, animate) {
		var point1 = this.getPoint(this.numPoints),
			point2 = this.getPoint(this.numPoints + 1, pointData);

		this.numPoints++;

		if (!animate) {
			// Draw Objects
			if (point1) {
				this.drawLine(this.numPoints, point1, point2);
				this.drawCircle(this.numPoints-1, point1.x, point1.y);
			}
			this.drawAxisMarker(this.numPoints, point2.x);
			this.drawCircle(this.numPoints, point2.x, point2.y);
		} else {
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
		var chartWidth = this.chartWidth,
			topMargin = 10,
			pointTime,
			realChartHeight,
			yPercentage,
			xPercentage;

		if (!answerItem && !this.points[i]) {
			return false;
		}

		if (answerItem) {
			this.points[i] = answerItem;
		} else {
			answerItem = this.points[i];
		}

		realChartHeight = this.chartHeight - this.chartSettings.chartBottomMargin - 10 - topMargin,
		yPercentage = (answerItem.avg/this.chartSettings.maxRating);

		pointTime = Date.parse(answerItem.time_sent);
		xPercentage = (pointTime - this.oldestTime) / this.totalGraphTimeDiff;

		console.log(pointTime, xPercentage);

		return {
			x: (xPercentage * (this.chartWidth-(2*this.chartSettings.chartMargin))) + this.chartSettings.chartMargin,
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
		var text = moment(this.answerData[i-1].time_sent).fromNow(true);

		text = text.replace(/minutes/gi, 'mins');
		text = text.replace(/hours/gi, 'hrs');

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
		for (var i = 1; i <= this.numPoints; i++) {
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
	}

});

export default = TimeSeriesChartView;
