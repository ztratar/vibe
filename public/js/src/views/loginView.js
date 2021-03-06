import 'backbone';
import 'underscore';
import BaseView from 'views/baseView';

module template from 'text!templates/loginView.html';

var LoginView = BaseView.extend({

	className: 'login-view',

	template: _.template(template),

	events: {
		'submit form': 'submitLogin',
		'touchstart button': 'submitLogin',
		'tap a.forgot-pass': 'forgotPassword',
		'tap a.request-access': 'requestAccess'
	},

	initialize: function(opts) {
		if (opts && opts.loginCallback) {
			this.loginCallback = opts.loginCallback;
		}
	},

	render: function() {
		var that = this;

		this.$el.html(this.template());

		_.delay(function() {
			that.$('input[name="email"]').focus();
		}, 200);

		this.delegateEvents();

		return this;
	},

	submitLogin: function() {
		var that = this,
			email = this.$('input[name="email"]').val(),
			password = this.$('input[name="password"]').val(),
			$button = this.$('button'),
			$error = this.$('.alert-danger');

		$error.html('').hide();

		$button.addClass('hit');

		_.delay(_.bind(function() {
			this.$('button').removeClass('hit');
		}, this), 400);

		if (!email.length) {
			$error.html('Please enter an email').show();
			return false;
		}

		if (!password.length) {
			$error.html('Please enter a password').show();
			return false;
		}

		$button.attr('disabled', 'disabled');
		$button.html('Logging in...');

		$.ajax({
			type: 'POST',
			url: window.Vibe.serverUrl + 'api/login',
			data:{
				email: email,
				password: password
			},
			success: function(d) {
				if (d.error) {
					$button.attr('disabled', false);
					$button.html('Log In');
					$error.html(d.error).show();
					return false;
				}

				if (typeof that.loginCallback === 'function') {
					that.loginCallback(d);
				}
			}
		});

		return false;
	},

	forgotPassword: function() {
		window.Vibe.appRouter.navigate('/forgotPassword', true);
		return false;
	},

	requestAccess: function () {
		window.Vibe.appRouter.navigate('/requestAccess', true);
		return false;
	}

});

export default = LoginView;
