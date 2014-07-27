define("views/settingsView", 
  ["backbone","underscore","helpers/avatarInputHelper","text!templates/settingsView.html","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";

    var avatarInputHelper = __dependency3__["default"];

    var template = __dependency4__;

    var SettingsView = Backbone.View.extend({

    	className: 'settings-view',

    	template: _.template(template),

    	events: {
    		'click a.name': 'editNamePage',
    		'click a.email': 'editEmailPage',
    		'click a.password': 'editPasswordPage',
    		'click a.manage-team': 'manageTeamPage',
    		'click a.manage-polls': 'managePollsPage',
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

    		avatarInputHelper($avatarInput, this.$('avatar-img'), $avatarText);

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

    	managePollsPage: function() {
    		window.Vibe.appRouter.navigateWithAnimation(
    			'settings/admin/polls',
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

    __exports__["default"] = SettingsView;
  });