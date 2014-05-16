define("splashApp", 
  ["jquery","underscore"],
  function(__dependency1__, __dependency2__) {
    "use strict";

    $(function() {
    	var showRequestAccessForm = function() {
    			$('.splash-intro').addClass('page-hide');
    			$('.splash-request-access').removeClass('page-hide');
    			$('input[name="email"]').focus();
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

    	$('.learn-more').on('click', function() {
    		var $body = $('body'),
    			scrollPos = $body.scrollTop(),
    			windowHeight = $(window).height();

    		$body.animate({
    			scrollTop: windowHeight
    		}, 280);

    		return false;
    	});

    	$('.get-beta-access').on('click', function() {
    		showRequestAccessForm();
    		return false;
    	});

		$('.cancel-request-access').on('click', function() {
			showIntroPage();
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
  });
