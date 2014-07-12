import 'jquery';

module Hammer from 'hammer';
module jqueryHammer from 'jqueryHammer';

$(function() {
	if (window.pageName !== 'login') {
		return;
	}

	$('input[name="email"]').focus();
	$('form.login').on('submit', function() {
		var email = $(this).find('input[name="email"]').val(),
			password = $(this).find('input[name="password"]').val(),
			$error = $(this).find('.alert-danger'),
			$button = $(this).find('button');

		$error.html('').hide();

		$button.addClass('hit');
		setTimeout(function() {
			$button.removeClass('hit');
		}, 400);

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
			url: '/api/login',
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

				window.location.reload();
			}
		});

		return false;
	});
});
