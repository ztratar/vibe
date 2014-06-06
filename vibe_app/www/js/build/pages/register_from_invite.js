define("pages/register_from_invite", 
  ["jquery","models/user","helpers/avatarInputHelper"],
  function(__dependency1__, __dependency2__, __dependency3__) {
    "use strict";

    var User = __dependency2__["default"];
    var avatarInputHelper = __dependency3__["default"];

    $(function() {
    	var email = /email=([^&]+)/.exec(window.location.search),
    	email = _.isArray(email) ? email[1] : null;

    	if (email && email.length) {
    		$('input[name="email"]').val(email.replace('+', ' '));
    	}

    	avatarInputHelper('#avatar-input', 'img.avatar-img', 'input[name="avatar_base64"]');

    	$('input[name="name"]').focus();

    	$('form').on('submit', function() {
    		var name = $(this).find('input[name="name"]').val(),
    			email = $(this).find('input[name="email"]').val(),
    			password = $(this).find('input[name="password"]').val(),
    			avatar_base64 = $(this).find('input[name="avatar_base64"]').val(),
    			hash = /hash=([^&]+)/.exec(window.location.search),
    			$error = $(this).find('.alert-danger'),
    			user;

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

    		user = new User({
    			name: name,
    			email: email,
    			avatar: avatar_base64,
    			password: password
    		});

    		user.save({
    			userInviteHash: hash
    		}, {
    			success: function(model, d) {
    				if (d.error) {
    					unmarkCurrentStepAsLoading();
    					$error.html(d.error).show();
    				} else {
    					window.location.href = '/';
    				}
    			}
    		});

    		return false;
    	});
    });
  });