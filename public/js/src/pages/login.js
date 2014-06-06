import 'jquery';

$(function() {
	$('input[name="email"]').focus();
	$('form.login').on('submit', function() {
		var email = $(this).find('input[name="email"]').val(),
			password = $(this).find('input[name="password"]').val(),
			$error = $(this).find('.alert-danger');

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
			url: '/api/login',
			data:{
				email: email,
				password: password
			},
			success: function(d) {
				if (d.error) {
					$error.html(d.error).show();
					return false;
				}

				window.location.reload();
			}
		});

		return false;
	});
});
