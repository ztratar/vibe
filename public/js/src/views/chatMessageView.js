import 'backbone';
module moment from 'moment';
module template from 'text!templates/chatMessageView.html';

var ChatMessageView = Backbone.View.extend({

	template: _.template(template),

	tagName: 'li',

	className: 'chatMessage-view',

	initialize: function() {
		this.model.on('change', this.render, this);
	},

	render: function() {
		this.$el.html(this.template(_.extend(this.model.toJSON(),{
			user: this.model.get('user').toJSON(),
			timeCreated: moment(this.model.get('timeCreated')).fromNow()
		})));
		return this;
	}

});

export default = ChatMessageView;
