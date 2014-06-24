import 'jquery';

$(function() {
	var $resetForm = $('form.reset_password'),
		$error = $resetForm.find('.alert-danger');

	$resetForm.on('submit', function() {
		var password1 = $(this).find('input[name="password-1"]').val(),
			password2 = $(this).find('input[name="password-2"]').val(),
			hash = /hash=(.+)&/.exec(window.location.search)[1],
			email = /email=(.+)/.exec(window.location.search)[1];

		$error.html('').hide();

		if (password1 !== password2) {
			$error
				.html("Password's given don't match.")
				.show();
			return false;
		} else if (!password1.length) {
			$error
				.html("Please input a new password.")
				.show();
			return false;
		}

		if (password1.length) {
			$.ajax({
				type: 'POST',
				url: '/api/users/'+email+'/reset_password',
				data:{
					password: password1,
					hash: hash,
					email: email
				},
				success: function(d) {
					if (d.error) {
						$error
							.html(d.error)
							.show();
						return false;
					}
					$('.form-step-wrapper').addClass('success');
				},
				error: function(d) {
				}
			});
		}

		return false;
	});
});
