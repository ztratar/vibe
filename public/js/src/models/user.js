import BaseModel from 'models/baseModel';

var User = BaseModel.extend({

	urlRoot: '/api/users',

	defaults: {
		name: '',
		email: '',
		avatar: '/img/default_avatar.png',
		company: {
			name: ''
		}
	},

	initialize: function(opts) {
		if (opts.avatar === '') {
			this.setAvatar();
		}
	},

	setAvatar: function() {
		if (this.get('avatar') === '') {
			this.set('avatar', this.defaults.avatar, {
				silent: true
			});
		}
	}

});

export default = User;
