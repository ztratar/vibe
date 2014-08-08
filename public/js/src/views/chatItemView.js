import 'backbone';
module moment from 'moment';
module template from 'text!templates/chatItem.html';

var ChatItemView = Backbone.View.extend({

	template: _.template(template),

	tagName: 'div',

	className: 'chat-item',

	events: {
		'click a.pull-down': 'pullDown'
	},

	initialize: function() {
		this.model.on('change', this.render, this);
		this.model.on('destroy', this.remove, this);
	},

	render: function() {
		var avatar = this.model.get('creator').avatar;

		if (avatar.indexOf('data:image') === -1) {
			avatar = window.Vibe.config.cloudfrontDomain + avatar;
		}

		this.$el.html(this.template({
			body: this.model.get('body'),
			userName: this.model.get('creator').name,
			userAvatar: avatar,
			timeago: moment(this.model.get('time_created')).fromNow(),
			showPullDown: window.Vibe.user.get('isAdmin') || this.model.get('creator').ref === window.Vibe.user.get('_id')
		}));

		this.$timeElem = this.$('span.time');

		if (this.timeUpdate) {
			clearInterval(this.timeUpdate);
		} else {
			this.timeUpdate = setInterval(_.bind(this.updateTime, this), 5000);
		}

		return this;
	},

	pullDown: function() {
		this.model.destroy();
		return false;
	},

	updateTime: function() {
		this.$timeElem.html(moment(this.model.get('time_created')).fromNow());
	},

	stopUpdateTime: function() {
		clearInterval(this.timeUpdate);
	}

});

export default = ChatItemView;
