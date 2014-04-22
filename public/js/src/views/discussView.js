import 'backbone';
import Comments from 'models/comments';
import CommentView from 'views/commentView';

module template from 'text!templates/discussView.html';

var DiscussView = Backbone.View.extend({

	className: 'discuss-view',

	template: _.template(template),

	events: {
		'keydown input': 'addComment'
	},

	initialize: function() {
		this.comments = new Comments([{
			text: 'sup'
		},{
			text: 'hey man'
		}]);
		this.comments.on('add', this.addOne, this);
		this.comments.on('reset', this.addAll, this);
	},

	render: function() {
		this.$el.html(this.template());
		this.$textInput = this.$('input');
		this.$commentsContainer = this.$('.comments');
		this.addAll();
		return this;
	},

	addComment: function(ev) {
		if (ev && ev.keyCode === 32) {
			var commentText = this.$textInput.val(),
				comment;	

			if (commentText) {
				this.$textInput.val('');	
				comment = new Comment({
					text: commentText
				});
				this.comments.add(comment);
			}

			ev.preventDefault();
			ev.stopPropagation();
			return false;
		}
	},

	addOne: function(comment) {
		var commentView = new CommentView({
			model: comment
		});	
		this.$commentsContainer.append(commentView.$el);
		commentView.render();
	},

	addAll: function() {
		this.$commentsContainer.empty();
		this.comments.each(_.bind(this.addOne, this));
	}

});

export default = DiscussView;
