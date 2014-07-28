import 'jquery';

import User from 'models/user';
import avatarInputHelper from 'helpers/avatarInputHelper';
import Analytics from 'helpers/analytics';

$(function() {
	if (window.pageName !== 'register_from_invite') {
		return;
	}

	var email = /email=([^&]+)/.exec(window.location.search),
	email = _.isArray(email) ? email[1] : null;

	if (email && email.length) {
		$('input[name="email"]').val(email.replace('+', ' '));
	}

	avatarInputHelper('#avatar-input', 'img.avatar-img', 'input[name="avatar_base64"]');

	$('input[name="name"]').focus();

	Analytics.log({
		eventCategory: 'register-from-invite',
		eventAction: 'page-loaded'
	});

	$('form').on('submit', function() {
		var name = $(this).find('input[name="name"]').val(),
			email = $(this).find('input[name="email"]').val(),
			password = $(this).find('input[name="password"]').val(),
			avatar_base64 = $(this).find('input[name="avatar_base64"]').val(),
			hash = /hash=([^&]+)/.exec(window.location.search),
			$button = $(this).find('button'),
			$error = $(this).find('.alert-danger'),
			user;

		hash = _.isArray(hash) ? hash[1] : undefined;

		$error.html('').hide();

		Analytics.log({
			eventCategory: 'register-from-invite',
			eventAction: 'submitted'
		});

		if (!email.length) {
			$error.html('Please enter an email').show();
			return false;
		}

		if (!password.length || password.length < 8) {
			$error.html('Please enter a password of at least 8 characters').show();
			return false;
		}

		if (!name.length) {
			$error.html('Please enter your name').show();
			return false;
		}

		$button.attr('disabled', 'disabled');
		$button.html('Creating your account...');

		Analytics.log({
			eventCategory: 'register-from-invite',
			eventAction: 'frontend-validation-passed'
		});

		$.ajax({
			url: '/api/users',
			method: 'POST',
			data: {
				name: name,
				email: email,
				avatar: avatar_base64,
				password: password,
				userInviteHash: hash
			},
			success: function(d) {
				if (d.error) {
					$error.html(d.error).show();
					Analytics.log({
						eventCategory: 'register-from-invite',
						eventAction: 'error',
						eventLabel: d.error
					});
					$button.attr('disabled', false);
					$button.html('Done!');
				} else {
					Analytics.log({
						eventCategory: 'register-from-invite',
						eventAction: 'success'
					});
					window.location.href = '/';
				}
			},
			error: function(d) {
				if (d.error) {
					Analytics.log({
						eventCategory: 'register-from-invite',
						eventAction: 'error',
						eventLabel: d.error
					});

					$error.html(d.error).show();
					$button.attr('disabled', false);
					$button.html('Done!');
				}
			}
		});

		return false;
	});
});
