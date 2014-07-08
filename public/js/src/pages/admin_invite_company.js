import 'jquery';

$(function() {
	if (window.pageName !== 'admin_invite_company') {
		return;
	}

	$('form.invite_company').on('submit', function() {
		var email = $(this).find('input[name="email"]').val(),
			company_name = $(this).find('input[name="company_name"]').val(),
			$error = $(this).find('.alert-danger');

		$error.html('').hide();

		if (!email.length) {
			$error.html('Please enter an email').show();
			return false;
		}

		if (!company_name.length) {
			$error.html('Please enter a company name').show();
			return false;
		}

		$.ajax({
			type: 'POST',
			url: '/api/access/invite',
			data: {
				email: email,
				company_name: company_name
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
