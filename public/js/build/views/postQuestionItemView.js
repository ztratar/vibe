define("views/postQuestionItemView", 
  ["backbone","underscore","views/confirmDialogView","text!templates/postQuestionItemView.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var ConfirmDialogView = __dependency3__["default"];

    var template = __dependency4__;

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