import 'backbone';
import MetaQuestions from 'models/metaQuestions';
import MetaQuestionSelectView from 'views/metaQuestionSelectView';

module template from 'text!templates/settingsView.html';

var SettingsView = Backbone.View.extend({

	className: 'settings-view',

	template: _.template(template),

	initialize: function() {
		this.metaQuestions = new MetaQuestions([{
			title: 'Scrum Process'	
		}, {
			questionSelected: true	
		}, {
			title: 'Design Deliverables'	
		}]);
		this.metaQuestions.on('add', this.addOne, this);
		this.metaQuestions.on('reset', this.addAll, this);
	},

	render: function() {
		this.$el.html(this.template());
		this.$metaContainer = this.$('.metaquestions');
		this.addAll();
		return this;
	},

	addOne: function(metaQuestion) {
		var metaQuestionView = new MetaQuestionSelectView({
			model: metaQuestion	
		});	
		this.$metaContainer.append(metaQuestionView.$el);
		metaQuestionView.render();
	},

	addAll: function() {
		this.$metaContainer.empty();
		this.metaQuestions.each(_.bind(this.addOne, this));
	}

});

export default = SettingsView;
