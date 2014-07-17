import 'backbone';
import 'underscore';

import avatarInputHelper from 'helpers/avatarInputHelper';

module template from 'text!templates/settingsView.html';

var SettingsView = Backbone.View.extend({

	className: 'settings-view',

	template: _.template(template),

	events: {
		'click a.name': 'editNamePage',
		'click a.email': 'editEmailPage',
		'click a.password': 'editPasswordPage',
		'click a.manage-team': 'manageTeamPage',
		'click a.edit-company-name': 'editCompanyName',
		'click a.edit-company-logo': 'editCompanyLogo',
		'click a.edit-company-cover': 'editCompanyCover',
		'click a.log-out': 'logOut'
	},

	initialize: function(opts) {
		this.user = opts.user;
		this.user.on('change', this.render, this);
	},

	render: function() {
		this.$el.html(this.template());
		this.applyAvatarBindings();
		return this;
	},


	applyAvatarBindings: function() {
		var $avatarInput = this.$('#avatar-input'),
			$avatarText = this.$('input[name="avatar_base64"]');

		avatarInputHelper($avatarInput, this.$('.avatar-img'), $avatarText);

		$avatarInput.on('avatar-helper-done', _.bind(function() {
			var avatarVal = $avatarText.val();

			this.user.save({
				avatar: avatarVal
			});
		}, this));
	},

	editNamePage: function() {
		window.Vibe.appRouter.navigateWithAnimation(
			'settings/name',
			'pushLeft',
			{
				trigger: true
			}
		);
		return false;
	},

	editEmailPage: function() {
		window.Vibe.appRouter.navigateWithAnimation(
			'settings/email',
			'pushLeft',
			{
				trigger: true
			}
		);
		return false;
	},

	editPasswordPage: function() {
		window.Vibe.appRouter.navigateWithAnimation(
			'settings/password',
			'pushLeft',
			{
				trigger: true
			}
		);
		return false;
	},

	manageTeamPage: function() {
		window.Vibe.appRouter.navigateWithAnimation(
			'settings/admin/team',
			'pushLeft',
			{
				trigger: true
			}
		);
		return false;
	},

	editCompanyName: function() {
		window.Vibe.appRouter.navigateWithAnimation(
			'settings/admin/company_name',
			'pushLeft',
			{
				trigger: true
			}
		);
		return false;
	},

	editCompanyLogo: function() {
		window.Vibe.appRouter.navigateWithAnimation(
			'settings/admin/company_logo',
			'pushLeft',
			{
				trigger: true
			}
		);
		return false;
	},

	editCompanyCover: function() {
		window.Vibe.appRouter.navigateWithAnimation(
			'settings/admin/company_cover',
			'pushLeft',
			{
				trigger: true
			}
		);
		return false;
	},

	logOut: function() {
		$.post('/api/logout', function(data) {
			window.location.reload();
		});

		return false;
	}

});

export default = SettingsView;
