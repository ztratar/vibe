import 'backbone';
import 'underscore';
import BaseView from 'views/baseView';
import RatingChartView from 'views/ratingChartView';

module template from 'text!templates/timeSeriesChartView.html';
module moment from 'moment';
module d3 from 'd3';

var TimeSeriesChartView = BaseView.extend({

	className: 'time-series-chart-view',

	template: _.template(template),

	chartSettings: {
		chartMargin: 80,
		chartBottomMargin: 24,
		maxRating: 4
	},

	smallChartSettings: {
		chartMargin: 24,
		chartBottomMargin: 24,
		maxRating: 4
	},

	smallChartWindowWidthBreakpoint: 550,

	events: {
		'tap a.back-to-time': 'closeRatingChart'
	},

	useSmallVersion: function() {
		return (this.windowWidth < this.smallChartWindowWidthBreakpoint) || this.forceSmallChart;
	},

	initialize: function(opts) {
		var that = this;

		this.model = opts.model;
		this.model.on('newAnswer', this.addNewAnswer, this);

		this.answerData = this.model.get('answer_data');

		if (this.answerData.length > 4) {
			this.answerData = _.last(this.answerData, 4);
		}

		this.forceSmallChart = opts.forceSmallChart || false;

		$(window).on('resize', _.throttle(function() {
			that.render();
		}, 16));
	},

	render: function() {
		this.$el.html(this.template());
		this.$ratingChartContainer = this.$el.find('.rating-chart-container');

		if (this.answerData.length > 1) {
			this.windowWidth = $(window).width();
			this.initChart();
			this.drawAxisGradient();
			for (var i = 0; i < this.answerData.length; i++) {
				this.addPoint(this.answerData[i]);
			}
			this.renderAxisText();
		}

		this.delegateEvents();
	},

	initChart: function() {
		var $chart = this.$('.time-series-chart');

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

		// Draw Objects
		if (point1) {
			this.drawLine(this.numPoints, point1, point2);
			this.drawCircle(this.numPoints-1, point1.x, point1.y);
		}
		this.drawAxisMarker(this.numPoints, point2.x);
		this.drawCircle(this.numPoints, point2.x, point2.y);

		if (pointData.avg === false) {
			var lastCircle = _.last(this.circles),
				lastLine = _.last(this.lines);
			lastCircle.attr('class', 'new');
			lastLine.attr('class', 'new');
		}
	},

	getChartMargin: function() {
		if (this.useSmallVersion()) {
			return this.smallChartSettings.chartMargin;
		}

		return this.chartSettings.chartMargin;
	},

	getPoint: function(i, answerItem) {
		var chartWidth = this.chartWidth,
			topMargin = this.useSmallVersion() ? 14 : 18,
			pointTime,
			realChartHeight,
			yPercentage,
			xPercentage,
			coords;

		if (!answerItem && !this.points[i]) {
			return false;
		}

		if (!answerItem) {
			return this.points[i];
		} else {
			realChartHeight = this.chartHeight - this.chartSettings.chartBottomMargin - 10 - topMargin,
			yPercentage = (answerItem.avg/this.chartSettings.maxRating);

			pointTime = Date.parse(answerItem.time_sent);
			xPercentage = (pointTime - this.oldestTime) / this.totalGraphTimeDiff;

			coords = {
				x: (xPercentage * (this.chartWidth-(2*this.getChartMargin()))) + this.getChartMargin(),
				y: topMargin + (realChartHeight * (1 - yPercentage)),
				avg: answerItem.avg
			};

			if (i > 1) {
				var prevPoint = this.getPoint(i-1);
				if (prevPoint) {
					coords.x = Math.max(coords.x, prevPoint.x + 70);
				}
				if (i === this.answerData.length - 1) {
					coords.x = Math.min(coords.x, this.chartWidth - this.getChartMargin() - 70);
				}
			}

			this.points[i] = coords;
		}

		return coords;
	},

	drawLine: function(i, point1, point2) {
		var line = this.svg.append('line')
				.attr('x1', point1.x)
				.attr('y1', point1.y);

		line.attr('x2', point2.x)
			.attr('y2', point2.y);

		this.lines[i] = line;

		return line;
	},

	drawCircle: function(i, x, y, r) {
		r = r || (this.useSmallVersion() ? 12 : 14);

		var that = this,
			circle = this.svg.append('circle')
				.attr('cx', x)
				.attr('cy', y)
				.attr('r', r);

		this.circles[i] = circle;

		circle
			.on('mouseenter', function(d) {
				circle.transition()
					.duration(300)
					.attr('r', r + 3);
			})
			.on('mouseleave', function(d) {
				circle.transition()
					.duration(300)
					.attr('r', r);
			})
			.on('click', function(d) {
				circle.transition()
					.duration(300)
					.attr('r', r+12);

				var ratingChartView = new RatingChartView({
					answerData: that.answerData[i-1]
				});
				that.$ratingChartContainer.html(ratingChartView.$el);
				ratingChartView.render();
				that.$el.addClass('show-rating');
			});

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
				{ offset: '90%', color: 'white' },
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

	addNewAnswer: function(answerBody) {
		var lastCircle = _.last(this.circles),
			lastLine = _.last(this.lines),
			lastData = _.last(this.answerData),
			that = this,
			oldValTotal,
			newValTotal,
			newAvg,
			newPoint;

		oldValTotal = lastData.num_completed * lastData.avg;
		newValTotal = oldValTotal + answerBody;
		newAvg = newValTotal / (lastData.num_completed+1);

		lastData.avg = newAvg;
		lastData.num_completed++;

		newPoint = this.getPoint(this.numPoints, lastData);

		_.delay(function() {
			lastLine.attr('class', 'anim');
			lastCircle.attr('class', 'anim');

			lastCircle.transition()
				.attr('cy', newPoint.y)
				.duration(800)

			lastLine.transition()
				.attr('x2', newPoint.x)
				.attr('y2', newPoint.y)
				.duration(800);
		}, 300);
	},

	closeRatingChart: function() {
		this.$el.removeClass('show-rating');
		return false;
	}

});

export default = TimeSeriesChartView;
