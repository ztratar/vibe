define("views/postQuestionItemView", 
  ["backbone","underscore","views/confirmDialogView","views/timeSeriesChartView","text!templates/postQuestionItemView.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __exports__) {
    "use strict";
    var ConfirmDialogView = __dependency3__["default"];
    var TimeSeriesChartView = __dependency4__["default"];

    var template = __dependency5__;

    var PostQuestionItemView = Backbone.View.extend({

    	tagName: 'li',

    	className: 'post-question-item-view',

    	template: _.template(template),

    	events: {
    		'click ul.answers a': 'vote',
    		'click a.discuss': 'discuss'
    	},

    	initialize: function(opts) {
    		this.model = opts.model;
    	},

    	render: function() {
    		this.$el.html(this.template({
    			model: this.model.toJSON()
    		}));

    		this.$voteResultsContainer = this.$('.vote-results-container');
    		this.$chartContainer = this.$('.chart-container');

    		this.renderChart();
    	},

    	renderChart: function() {
    		this.chartView = new TimeSeriesChartView({
    			model: this.model.get('question')
    		});

    		this.$chartContainer.html(this.chartView.$el);
    		this.chartView.render();
    	},

    	vote: function(ev) {
    		var $target = $(ev.currentTarget),
    			answerBody = parseInt($target.attr('data-answer'), 10);

    		this.$voteResultsContainer.addClass('voted');
    		this.model.get('question').answer(answerBody);

    		return false;
    	},

    	discuss: function() {

    		return false;
    	}

    });

    __exports__["default"] = PostQuestionItemView;
  });