import 'backbone';
import 'underscore';

module template from 'text!templates/loginView.html';

var LoginView = Backbone.View.extend({

	className: 'login-view',

	template: _.template(template),

	events: {
		'submit form': 'submitLogin',
		'click button': 'submitLogin'
	},

	initialize: function(opts) {
		if (opts && opts.loginCallback) {
			this.loginCallback = opts.loginCallback;
		}
	},

	render: function() {
		this.$el.html(this.template());

		_.delay(function() {
			that.$('input[name="email"]').focus();
		}, 200);

		return this;
	},

	submitLogin: function() {
		var that = this,
			email = this.$('input[name="email"]').val(),
			password = this.$('input[name="password"]').val(),
			$error = this.$('.alert-danger');

		$error.html('').hide();

		if (!email.length) {
			$error.html('Please enter an email').show();
			return false;
		}

		if (!password.length) {
			$error.html('Please enter a password').show();
			return false;
		}

		$.ajax({
			type: 'POST',
			url: window.Vibe.serverUrl + 'api/login',
			data:{
				email: email,
				password: password
			},
			success: function(d) {
				if (d.error) {
					$error.html(d.error).show();
					return false;
				}

				if (typeof that.loginCallback === 'function') {
					that.loginCallback(d);
				}
			}
		});

		return false;
	}

});

export default = LoginView;
