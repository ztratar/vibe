import BaseModel from 'models/baseModel';

var User = BaseModel.extend({

	urlRoot: window.Vibe.serverUrl + 'api/users',

	defaults: {
		name: '',
		email: '',
		avatar: '/img/default_avatar.png',
		company: {
			name: ''
		}
	},

	initialize: function(opts) {
		if (opts && opts.avatar === '') {
			this.setAvatar();
		}
	},

	setAvatar: function() {
		if (this.get('avatar') === '') {
			this.set('avatar', this.defaults.avatar, {
				silent: true
			});
		}
	},

	makeAdmin: function() {
		this.save({
			isAdmin: true
		});
	},

	removeAdmin: function() {
		this.save({
			isAdmin: false
		});
	},

	fetchCurrentUser: function(cb, errorCb) {
		this.fetch({
			url: window.Vibe.serverUrl + 'api/users/me',
			success: function(model, data) {
				if (typeof cb === 'function') {
					cb(model, data);
				}
			},
			error: function(data) {
				if (typeof errorCb === 'function') {
					errorCb(data);
				}
			}
		});
	}

});

export default = User;
