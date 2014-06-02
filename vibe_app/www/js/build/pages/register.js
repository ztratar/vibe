define("pages/register", 
  ["jquery"],
  function(__dependency1__) {
    "use strict";

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
    		};

    	setTimeout(function() {
    		nextStep();
    	}, 2000);

    	$('form.step-1').on('submit', function() {
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
  });