define("views/chartItemView", 
  ["backbone","text!templates/chartItemView.html","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var template = __dependency2__;

    var ChartItemView = Backbone.View.extend({
    	tagName: 'li',
    	className: 'chart-item',
    	template: _.template(template),
    	events: {
    		'touchstart a.discuss': 'discuss',
    		'click a.discuss': 'discuss'
    	},
    	initialize: function() {
    		this.model.on('change', this.render);
    	},
    	render: function() {
    		this.$el.html(this.template(this.model.toJSON()));
    		return this;
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

    __exports__["default"] = ChartItemView;
  });