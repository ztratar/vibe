define("pages/register", 
  ["jquery","underscore","backbone","models/user","views/questionPickerView"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__) {
    "use strict";

    var User = __dependency4__["default"];
    var QuestionPickerView = __dependency5__["default"];

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

    	nextStep();
    	nextStep();

    	// Form logic
    	$('form.step-1').on('submit', function() {
    		var name = $(this).find('input[name="name"]').val(),
    			email = $(this).find('input[name="email"]').val(),
    			password = $(this).find('input[name="password"]').val(),
    			avatar_base64 = $(this).find('input[name="avatar_base64"]').val(),
    			company_name = $(this).find('input[name="company_name"]').val(),
    			company_website = $(this).find('input[name="company_website"]').val(),
    			hash = /hash=([^&]+)/.exec(window.location.search),
    			$error = $(this).find('.alert-danger');

    		hash = _.isArray(hash) ? hash[1] : undefined;

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

    		if (!company_name.length) {
    			$error.html('Please enter your company name').show();
    			return false;
    		}

    		if (!company_website.length) {
    			$error.html('Please enter your company website').show();
    			return false;
    		}

    		markCurrentStepAsLoading();

    		user = new User({
    			name: name,
    			email: email,
    			avatar: avatar_base64
    		});

    		user.save({
    			password: password,
    			companyName: company_name,
    			companyWebsite: company_website,
    			companyInviteHash: hash
    		}, {
    			success: function(model, d) {
    				if (d.error) {
    					unmarkCurrentStepAsLoading();
    					$error.html(d.error).show();
    				} else {
    					nextStep();
    				}
    			}
    		});

    		return false;
    	});

    	// Step 2
    	var questionPicker = new QuestionPickerView();
    	$('.question-picker-container').html(questionPicker.$el);
    	questionPicker.render();

    	$('form.step-2').on('submit', function() {
    		nextStep();
    		return false;
    	});

    	$('form.step-3').on('submit', function() {
    		window.location.href = '/';
    		return false;
    	});
    });
  });