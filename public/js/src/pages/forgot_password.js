import 'jquery';

$(function() {
	if (window.pageName !== 'forgot_password') {
		return;
	}

	$('form.forgot_password').on('submit', function() {
		var email = $(this).find('input[name="email"]').val(),
			$error = $(this).find('.alert-danger');

		$error.html('').hide();

		if (!email.length) {
			$error.html('Please enter an email').show();
			return false;
		}

		$.ajax({
			type: 'POST',
			url: '/api/users/'+email+'/forgot_password',
			data:{
				email: email
			},
			success: function(d) {
				if (d.error) {
					$error.html(d.error).show();
					return;
				}
				$('.form-step-wrapper').addClass('success');
			}
		});

		return false;
	});
});
