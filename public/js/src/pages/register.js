import 'jquery';
import 'underscore';
import 'backbone';

import QuestionPickerView from 'views/questionPickerView';

$(function() {
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
		company_name = /company_name=(.+)&/.exec(window.location.search),
		email = /email=(.+)/.exec(window.location.search),
		user;

	company_name = _.isArray(company_name) ? company_name[1] : null;
	email = _.isArray(email) ? email[1] : null;

	// Prefill as much information as possible. Info
	// should be passed from the email that directed
	// users to this page.
	if (company_name && company_name.length) {
		$('input[name="company_name"]').val(company_name.replace('+', ' '));
	}
	if (email && email.length) {
		$('input[name="email"]').val(email.replace('+', ' '));
	}
	$('input[name="name"]').focus();

	// Load page logic
	var questionPicker = new QuestionPickerView();
	$('.question-picker-container').html(questionPicker.$el);
	questionPicker.render();

	// Avatar Upload
	// Uses filereader, which is supported in most modern browsers.
	$("#avatar-input").change(function(){
		if (this.files && this.files[0]) {
			var FR = new FileReader();

			FR.onload = function(e) {
				var tempImg = new Image();

				tempImg.src = e.target.result;
				tempImg.onload = function() {
					var SQUARE_WIDTH = 120;
					var tempW = tempImg.width;
					var tempH = tempImg.height;
					var startX = 0;
					var startY = 0;

					if (tempW > tempH) {
						tempW = tempH;
						//tempW *= SQUARE_WIDTH / tempH;

						startX = (tempImg.width - tempImg.height) / 2;
					} else {
						tempH = tempW;
						//tempW = SQUARE_WIDTH;
						//tempH *= SQUARE_WIDTH / tempW;

						startY = (tempImg.height - tempImg.width) / 2;
					}

					var canvas = document.createElement('canvas');
					canvas.width = tempW;
					canvas.height = tempH;

					var ctx = canvas.getContext("2d");
					ctx.drawImage(this, startX, startY, tempW, tempH, 0, 0, tempW, tempH);
					ctx.scale(SQUARE_WIDTH / tempW, SQUARE_WIDTH / tempH);

					var dataURL = canvas.toDataURL("image/jpeg");
					$('img.avatar-img').attr("src", dataURL);
					$('input[name="avatar_base64"]').val(dataURL);
				};
			};
			FR.readAsDataURL(this.files[0]);
		}
	});

	// Form logic
	$('form.step-1').on('submit', function() {

		nextStep();
		return false;
		var name = $(this).find('input[name="name"]').val(),
			email = $(this).find('input[name="email"]').val(),
			avatar_base64 = $(this).find('input[name="avatar_base64"]').val(),
			company_name = $(this).find('input[name="company_name"]').val(),
			hash = /hash=(.+)&/.exec(window.location.search)[1],
			$error = $(this).find('.alert-danger');

		$error.html('').hide();

		if (!email.length) {
			$error.html('Please enter an email').show();
			return false;
		}

		if (!name.length) {
			$error.html('Please enter your name').show();
			return false;
		}

		if (!company_name.length) {
			$error.html('Please enter your company name').show();
			return false;
		}

		$.ajax({
			type: 'POST',
			url: '/api/users',
			data:{
				email: email,
				name: name,
				company_name: company_name,
				avatar: avatar_base64,
				hash: hash
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

	$('form.step-2').on('submit', function() {
		nextStep();
		return false;
	});

	$('form.step-3').on('submit', function() {
		window.location.href = '/';
		return false;
	});
});
