import 'backbone';
module template from 'text!templates/metaQuestionSelectView.html';

var MetaQuestionSelectView = Backbone.View.extend({

	template: _.template(template),

	tagName: 'a',

	className: 'settings-item-row meta-question-select-view',

	events: {
		'click': 'clicked'
	},

	initialize: function() {
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},

	clicked: function() {
		if (this.model.get('questionSelected')) {
			this.model.deselect();
			this.$('i').removeClass('selected');
		} else {
			this.model.select();
			this.$('i').addClass('selected');
		}

		return false;
	}

});

export default = MetaQuestionSelectView;
