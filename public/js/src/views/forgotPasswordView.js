import 'backbone';
import BaseView from 'views/baseView';

module template from 'text!templates/forgotPasswordView.html';

var ForgotPasswordView = BaseView.extend({

	className: 'forgot-password-view',

	template: _.template(template),

	events: {
		'tap a.back': 'backToLogin',
		'submit form': 'submitForm',
		'touchstart button': 'submitForm'
	},

	render: function() {
		this.$el.html(this.template());
		this.delegateEvents();

		return this;
	},

	submitForm: function() {
		var that = this,
			email = this.$('input[name="email"]').val(),
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

		$button.attr('disabled', 'disabled');
		$button.html('Loading...');

		$.ajax({
			type: 'POST',
			url: window.Vibe.serverUrl + 'api/users/'+email+'/forgot_password',
			data:{
				email: email
			},
			success: function(d) {
				if (d.error) {
					$button.attr('disabled', false);
					$button.html('Reset Password');
					$error.html(d.error).show();
					return false;
				} else {
					$button.html('Check your email!');

					setTimeout(function() {
						window.Vibe.appRouter.navigate('/login');
					}, 8000);
				}
			}
		});

		return false;
	},

	backToLogin: function() {
		window.Vibe.appRouter.navigate('/login', true);
		return false;
	}

});

export default = ForgotPasswordView;
