import 'backbone';
import 'underscore';

import MetaQuestions from 'models/metaQuestions';
import MetaQuestionSelectView from 'views/metaQuestionSelectView';

module template from 'text!templates/settingsView.html';

var SettingsView = Backbone.View.extend({

	className: 'settings-view',

	template: _.template(template),

	events: {
		'click a.trigger-survey': 'triggerSurvey',
		'click a.log-out': 'logOut'
	},

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
	},

	triggerSurvey: function() {
		_.delay(function() {
			window.Vibe.appView.checkForNewSurvey();
		}, 2800);

		return false;
	},

	logOut: function() {
		$.post('/api/logout', function(data) {
			window.location.reload();
		});

		return false;
	}

});

export default = SettingsView;
