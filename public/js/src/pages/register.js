import 'jquery';
import 'underscore';
import 'backbone';

import User from 'models/user';
import UserListInviteView from 'views/userListInviteView';

import avatarInputHelper from 'helpers/avatarInputHelper';
import imageInputHelper from 'helpers/imageInputHelper';
import Analytics from 'helpers/analytics';
import Cookies from 'helpers/cookies';

$(function() {
	if (window.pageName !== 'register') {
		return;
	}

	var $steps = $('ul.steps li'),
		nextStep = function() {
			var $activeForm = $('form.active:not(.old)'),
				$activeStepMarker = $('ul.steps li.active:not(.old)'),
				$nextForm = $activeForm.next(),
				$nextStep = $activeStepMarker.next();

			$activeForm.addClass('old');
			$activeStepMarker.addClass('old');
			$nextForm.addClass('active');
			$nextStep.addClass('active');
		},
		prevStep = function() {
			var $activeForm = $('form.active:not(.old)'),
				$activeStepMarker = $('ul.steps li.active:not(.old)'),
				$prevForm = $activeForm.prev(),
				$prevStep = $activeStepMarker.prev();

			$activeForm.removeClass('active');
			$activeStepMarker.removeClas('active');
			$prevForm.removeClass('old');
			$prevStep.removeClass('old');
		},
		markCurrentStepAsLoading = function() {
			var $activeForm = $('form.active:not(.old)');
			$activeForm.addClass('loading');
			$activeForm.find('input, button').prop('disabled', true);
		},
		unmarkCurrentStepAsLoading = function() {
			var $activeForm = $('form.active:not(.old)');
			$activeForm.addClass('loading');
			$activeForm.find('input, button').prop('disabled', false);
		},
		company_name = /company_name=(.+)&/.exec(window.location.search),
		email = /email=(.+)/.exec(window.location.search),
		user = new User();

	company_name = _.isArray(company_name) ? company_name[1] : null;
	email = _.isArray(email) ? email[1] : null;

	// Prefill as much information as possible. Info
	// should be passed from the email that directed
	// users to this page.
	if (company_name && company_name.length) {
		$('input[name="company_name"]').val(company_name.replace(/\+/g, ' '));
	}
	if (email && email.length) {
		$('input[name="email"]').val(email.replace('+', ' '));
	}
	$('input[name="name"]').focus();

	avatarInputHelper('#avatar-input', 'img.avatar-img', 'input[name="avatar_base64"]');
	imageInputHelper('#form-img-input', 'img.form-img', 'input[name="form-img_base64"]', {
		maxWidth: 220,
		maxHeight: 90
	});

	Analytics.log({
		eventCategory: 'register',
		eventAction: 'page-loaded'
	});

	// Form logic
	$('form.step-1').on('submit', function() {
		var name = $(this).find('input[name="name"]').val(),
			email = $(this).find('input[name="email"]').val(),
			password = $(this).find('input[name="password"]').val(),
			avatar_base64 = $(this).find('input[name="avatar_base64"]').val(),
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

		if (!name.length) {
			$error.html('Please enter your name').show();
			return false;
		}

		var stringifiedInfo = JSON.stringify({
			name: name,
			email: email
		});

		Analytics.log({
			eventCategory: 'register',
			eventAction: 'step-1-submitted',
			eventLabel: stringifiedInfo
		});

		nextStep();

		return false;
	});

	// Step 2
	$('form.step-2').on('submit', function() {
		var form1 = $('form.step-1'),
			name = form1.find('input[name="name"]').val(),
			email = form1.find('input[name="email"]').val(),
			password = form1.find('input[name="password"]').val(),
			avatar_base64 = form1.find('input[name="avatar_base64"]').val(),
			hash = /hash=([^&]+)/.exec(window.location.search),
			$error = $(this).find('.alert-danger'),
			company_name = $(this).find('input[name="company_name"]').val(),
			company_website = $(this).find('input[name="company_website"]').val(),
			company_logo = $(this).find('input[name="form-img_base64"]').val();

		hash = _.isArray(hash) ? hash[1] : undefined;

		if (!company_name.length) {
			$error.html('Please enter your company name').show();
			return false;
		}

		if (!company_website.length) {
			$error.html('Please enter your company website').show();
			return false;
		}

		markCurrentStepAsLoading();

		var stringifiedInfo = JSON.stringify({
			name: name,
			email: email,
			company_name: company_name,
			company_website: company_website,
			company_logo: company_logo ? true : false
		});

		Analytics.log({
			eventCategory: 'register',
			eventAction: 'step-2-submitted',
			eventLabel: stringifiedInfo
		});

		$.ajax({
			url: '/api/users',
			method: 'POST',
			data: {
				name: name,
				email: email,
				avatar: avatar_base64,
				password: password,
				companyName: company_name,
				companyWebsite: company_website,
				companyLogo: company_logo,
				companyInviteHash: hash
			},
			success: function(d) {
				if (d.error) {
					Analytics.log({
						eventCategory: 'register',
						eventAction: 'step-2-error',
						eventLabel: d.error
					});

					unmarkCurrentStepAsLoading();
					$error.html(d.error).show();
				} else {
					nextStep();
				}
			}
		});

		return false;
	});

	var userListInviteView = new UserListInviteView({
		currentUser: user
	});
	$('.user-list-invite-container').html(userListInviteView.$el);
	userListInviteView.render();

	$('form.step-3').on('submit', function() {
		var inviteData = [],
			$inviteEmails = $(this).find('input[name="invite_email"]'),
			$inviteAdmins = $(this).find('input[name="invite_admin"]');

		$inviteEmails.each(function(i, emailItem) {
			var email = $(emailItem).val(),
				admin = $inviteAdmins.eq(i).is(':checked');

			if (email && email.length) {
				inviteData.push({
					email: email,
					isAdmin: admin
				});
			}
		});

		Analytics.log({
			eventCategory: 'register',
			eventAction: 'step-3-submitted',
			eventLabel: 'Invited ' + inviteData.length
		});

		if (!inviteData.length) {
			window.location.href = '/';
		} else {
			$.ajax({
				url: '/api/userinvites/batch_invite',
				type: 'POST',
				data: {
					users: inviteData
				},
				success: function() {
					window.location.href = '/';
				}
			});
		}

		return false;
	});
});
