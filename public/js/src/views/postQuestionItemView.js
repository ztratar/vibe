import 'backbone';
import 'underscore';
import ConfirmDialogView from 'views/confirmDialogView';

module template from 'text!templates/postQuestionItemView.html';

var PostQuestionItemView = Backbone.View.extend({

	tagName: 'li',

	className: 'post-question-item-view',

	template: _.template(template),

	events: {
		'click a.discuss': 'discuss'
	}

	initialize: function(opts) {
		this.model = opts.model;
	},

	render: function() {
		this.$el.html(this.template({
			model: this.model.toJSON()
		}));
	},

	discuss: function() {

		return false;
	}

});

export default = PostQuestionItemView;
