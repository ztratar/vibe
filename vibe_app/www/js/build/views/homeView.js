define("views/homeView", 
  ["backbone","models/questions","views/chartsView","text!templates/homeView.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Questions = __dependency2__["default"];
    var ChartsView = __dependency3__["default"];
    var template = __dependency4__;

    var HomeView = Backbone.View.extend({
    	className: 'home-view',
    	template: _.template(template),
    	initialize: function() {
    		this.questions = new Questions();
    		this.chartsView = new ChartsView({
    			collection: this.questions	
    		});	
    	},
    	render: function() {
    		this.$el.html(this.template({
    			user: window.Vibe.user.toJSON()	
    		}));
    		this.$('.charts-container').html(this.chartsView.$el);
    		this.questions.add([{}, {
    			title: 'Design Deliverables'	
    		}, {
    			title: 'Scrum Process'	
    		}, {
    			title: 'Productivity',
    			body: '<strong>Productivity</strong> is going...'
    		}, {
    			title: 'Goals & Focus',
    			body: 'We <strong>focus</strong> on our <strong>goals</strong>...'
    		}]);
    		return this;
    	}
    });

    __exports__["default"] = HomeView;
  });