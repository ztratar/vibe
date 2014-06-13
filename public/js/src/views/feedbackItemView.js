import 'underscore';
import 'backbone';

import ConfirmDialogView from 'views/confirmDialogView';

module template from 'text!templates/feedbackItemView.html';

var FeedbackItemView = Backbone.View.extend({

	tagName: 'li',

	className: 'feedback-item-view',

	template: _.template(template),

	events: {
		'click a.agree': 'agree',
		'click a.agreed': 'undoAgree',
		'click a.pull-down': 'adminPullDown'
	},

	initialize: function(opts) {
		this.model = opts.model;

		this.model.on('change', this.render, this);
		this.model.get('feedback').on('change', this.render, this);

		this.model.on('destroy', this.remove, this);
	},

	render: function() {
		var modelJSON = this.model.toJSON();

		this.$el.html(this.template({
			model: modelJSON
		}));

		this.$score = this.$('.score');

		return this;
	},

	agree: function() {
		var that = this,
			feedback = this.model.get('feedback');

		feedback.agree();

		this.$score.addClass('pop');

		setTimeout(function() {
			that.$score.removeClass('pop');
		}, 500);

		return false;
	},

	undoAgree: function() {
		var that = this,
			feedback = this.model.get('feedback');

		feedback.undoAgree();

		this.$score.addClass('pop-reverse');

		setTimeout(function() {
			that.$score.removeClass('pop-reverse');
		}, 500);

		return false;
	},

	adminPullDown: function() {
		var that = this,
			confirmView = new ConfirmDialogView({
				title: 'Are you sure?',
				body: 'As an admin, you can remove this piece of feedback instantly by clicking confirm. This will also delete all relevant discussion.',
				onConfirm: function() {
					that.model.trigger('destroy');
					that.model.get('feedback').pullDown();
				}
			});

		window.Vibe.appView.showOverlay(confirmView);

		return false;
	}

});

export default = FeedbackItemView;
