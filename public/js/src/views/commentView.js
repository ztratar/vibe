import 'backbone';
module template from 'text!templates/commentView.html';

var CommentView = Backbone.View.extend({

	template: _.template(template),

	tagName: 'li',

	className: 'comment-view',

	initialize: function() {
		this.model.on('change', this.render, this);
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}

});

export default = CommentView;
