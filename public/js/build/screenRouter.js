define("screenRouter", 
  ["jquery","underscore","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";

    var ScreenRouter = function() {};

    _.extend(ScreenRouter.prototype, {
    	stateStack: [],
    	validAnimations: [
    		'pushLeft',
    		'pushRight',
    		'slideUp',
    		'slideDown',
    		'fade'	
    	],
    	navigate: function(screenView, animation) {
    		if (!_.contains(animation, this.validAnimations)) {
    			console.log('error', 'animation attempted not valid');
    			return false;
    		}
    		this.stateStack.push(animation);
    		this.createNewScreen(screenView, animation);

    		return true;
    	},
    	initCurrentScreen: function() {
    		this.currentScreen = $('.screen.current');
    	},
    	createNewScreen: function(animation, cb) {
    		// If a screen has current when the animation
    		// is called, it should be entering the screen.
    		// Else, it is leaving the screen.

    		if (this.currentScreen) {
    			this.oldScreen = this.currentScreen;
    			this.oldScreen.removeClass('current');
    		}

    		this.currentScreen = $('<div class="screen current"></div>');
    		this.currentScreen.appendTo($('body'));

    		if (animation && animation.length) {
    			if (this.oldScreen) {
    				this.oldScreen.addClass('animate-' + animation);
    			}
    			this.currentScreen.addClass('animate-' + animation);
    		}

    		_.delay(_.bind(this.removeOldScreen, this), 3000);
    		cb && cb(this.currentScreen);

    		return this.currentScreen;
    	},
    	removeOldScreen: function() {
    		if (this.oldScreen) {
    			this.oldScreen.remove();
    			delete this.oldScreen;
    		}
    	}
    });

    __exports__["default"] = ScreenRouter;
  });