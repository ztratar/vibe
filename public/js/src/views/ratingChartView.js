import 'backbone';

module d3 from 'd3';

var RatingChartView = Backbone.View.extend({

	className: 'rating-chart-view',

	chartSettings: {
		chartMargin: 60,
		chartBottomMargin: 84,
		barWidth: 40,
		numAnswerKeys: 4
	},

	initialize: function(opts) {
		this.model = opts.model;

		this.model.on('newAnswer', this.addNewAnswer, this);
	},

	render: function() {
		this.initChart();
	},

	initChart: function() {
		this.bars = [];
		this.chartHeight = this.$el.height();
		this.chartWidth = this.$el.width();

		this.svg = d3.select(this.$el[0])
			.append("svg")
			.attr("height", this.chartHeight)
			.attr("width", this.chartWidth);

		this.answerData = this.model.get('answer_data')[0];
		this.processData();

		this.drawChart();
	},

	// Turns the given answer data from the question
	// into a mapping of vote -> num_votes
	processData: function() {
		var that = this;

		this.groupedBarData = _.groupBy(this.answerData.answers, function(vote) {
			return vote;
		});
		_.each(this.groupedBarData, function(data, key) {
			that.groupedBarData[key] = data.length;
		});

		for (var i = 1; i < 5; i++) {
			that.groupedBarData[i] = that.groupedBarData[i] || 0;
		}

		this.modeNum = _.max(this.groupedBarData);
	},

	drawChart: function() {
		var that = this;

		this.usableWidth = this.chartWidth - 2*this.chartSettings.chartMargin;
		this.barCalcInterval = (this.usableWidth - this.chartSettings.barWidth) / (this.chartSettings.numAnswerKeys - 1);

		_.each(this.groupedBarData, function(data, key) {
			that.drawBar(key, data);
		});
	},

	drawBar: function(voteKey, voteData) {
		var barYInfo = this.getBarCoords(voteData),
			barHeight = barYInfo.height,
			startY = barYInfo.startY,
			barXPos = this.chartSettings.chartMargin + (voteKey-1) * this.barCalcInterval,
			imgMap = {
				1: 'img/cry-100.png',
				2: 'img/sad-100.png',
				3: 'img/happy-100.png',
				4: 'img/lol-100.png'
			},
			zerodValue = false;

		if (barHeight === 0) {
			zerodValue = true;
			barHeight = 10;
			startY -= 10;
		}

		var rect = this.svg
					.append('rect')
					.attr('width', this.chartSettings.barWidth)
					.attr('height', barHeight)
					.attr('x', barXPos)
					.attr('y', startY);

		var img = this.svg
					.append('svg:image')
					.attr('width', 40)
					.attr('height', 40)
					.attr('x', barXPos)
					.attr('y', 20 + this.chartHeight - this.chartSettings.chartBottomMargin)
					.attr('xlink:href', window.staticRoute + imgMap[voteKey]);

		if (zerodValue) rect.attr('class', 'zero');

		this.bars.push(rect);
	},

	getBarCoords: function(voteData) {
		var barHeight = (this.chartHeight-this.chartSettings.chartBottomMargin) * (voteData / this.modeNum),
			barYPos = this.chartHeight - barHeight - this.chartSettings.chartBottomMargin;

		return {
			height: barHeight,
			startY: barYPos
		};
	},

	addNewAnswer: function(newAnswer) {
		var that = this,
			newBarCoords = [],
			i = 0;

		// Wait for chart to animate in
		_.delay(function() {
			// Add new answer to data set
			// & re-calc necessary vars
			that.answerData.answers.push(newAnswer);
			that.processData();

			// Get new bar coords
			_.each(that.groupedBarData, function(data, key) {
				newBarCoords[i++] = that.getBarCoords(data);
			});

			// Animate new bar coords
			_.each(that.bars, function(bar, ind) {
				var barHeight = newBarCoords[ind].height,
					startY = newBarCoords[ind].startY;

				if (barHeight === 0) {
					bar.attr('class', 'zero');
					barHeight = Math.max(barHeight, 10);
					startY -= 10;
				} else {
					bar.attr('class', '');
				};

				bar.transition()
					.attr('class', '')
					.attr('height', barHeight)
					.attr('y', startY)
					.duration(800);
			});
		}, 300);
	}

});

export default = RatingChartView;
