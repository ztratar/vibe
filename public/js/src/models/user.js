import BaseModel from 'models/baseModel';
import Company from 'models/company';

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

		this.setCompany();

		this.on('change:company', this.setCompany, this);
	},

	setCompany: function() {
		var company = this.get('company');

		if (company instanceof Company) {
			return;
		}

		company = new Company(this.get('company'));

		this.set('company', company, { silent: true });
	},

	getAvatar: function() {
		var avatar = this.get('avatar');

		if (avatar.indexOf('data:image') === -1) {
			return window.Vibe.config.cloudfrontDomain + avatar;
		} else {
			return avatar;
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
	},

	setTutorialFinished: function(tutName) {
		var tutorial = this.get('tutorial');
		tutorial[tutName] = true;

		this.save({
			tutorial: tutorial
		});
	}

});

export default = User;
