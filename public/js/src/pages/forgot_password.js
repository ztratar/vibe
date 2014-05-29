import 'jquery';

$(function() {
	$('form.forgot_password').on('submit', function() {
		var email = $(this).find('input[name="email"]').val();

		if (email.length) {
			$.ajax({
				type: 'POST',
				url: '/api/users/'+email+'/forgot_password',
				data:{
					email: email
				},
				success: function(d) {
					$('.form-step-wrapper').addClass('success');
				},
				error: function(d) {
					console.log('err', d);
				}
			});
		}

		return false;
	});
});
