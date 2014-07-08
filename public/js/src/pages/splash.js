import 'jquery';
import 'underscore';

$(function() {
	var showRequestAccessForm = function() {
			$('.splash-intro').addClass('page-hide');
			$('.splash-request-access').removeClass('page-hide');
			_.delay(function() {
				$('input[name="email"]').focus();
			}, 500);
		},
		showIntroPage = function() {
			$('.splash-intro').removeClass('page-hide');
			$('.splash-request-access').addClass('page-hide');
		},
		accessRequestSuccess = function() {
			$('.splash-buttons').hide();
			$('.beta-success').css('display', 'inline-block').removeClass('hide');
			showIntroPage();
		},
		showRequestError = function(error) {
			$('#requestAccessForm .error-field').html(error).removeClass('hide');
		};

	if (window.location.hash === '#access') {
		showRequestAccessForm();
	}

	$('.learn-more').on('click', function() {
		var $body = $('body'),
			scrollPos = $body.scrollTop(),
			windowHeight = $(window).height();

		$body.animate({
			scrollTop: windowHeight
		}, 280);

		return false;
	});

	$('.cancel-request-access').on('click', function() {
		showIntroPage();
		return false;
	});

	$('.get-beta-access').on('click', function() {
		showRequestAccessForm();
		return false;
	});

	$('#requestAccessForm').on('submit', function() {
		var email = $('input[name="email"]').val(),
			companyName = $('input[name="company_name"]').val();

		if (!email || !email.length) {
			showRequestError('Email cannot be blank');
			$('input[name="email"]').focus();
			return false;
		}

		$('#requestAccessForm .error-field').addClass('hide');

		$.ajax({
			url: '/api/access/request',
			type: 'POST',
			data: {
				email: email,
				company_name: companyName
			},
			success: function(resp) {
				if (resp.error) {
					showRequestError(resp.error);
					return false;
				}

				accessRequestSuccess(resp);
			}
		});

		return false;
	});
});
