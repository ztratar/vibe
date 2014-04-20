import 'jquery';
import 'underscore';

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
			this.removeOldScreen();
			this.oldScreen = this.currentScreen;
		}

		this.currentScreen = $('<div class="screen new"></div>');
		this.currentScreen.appendTo($('body'));

		this.animateScreens(animation);

		_.delay(_.bind(this.removeOldScreen, this), 3000);
		cb && cb(this.currentScreen);

		return this.currentScreen;
	},
	animateScreens: function(animation) {
		var animationClass = '';
		if (animation && animation.length) {
			animationClass = 'animate-' + animation;
		}

		this.currentScreen.addClass(animationClass);

		_.defer(_.bind(function() {
			if (this.oldScreen) {
				this.oldScreen.attr('class', 'screen old ' + animationClass);
			}
			this.currentScreen.attr('class', 'screen current ' + animationClass);
		}, this));
	},
	removeOldScreen: function() {
		if (this.oldScreen) {
			this.oldScreen.remove();
			delete this.oldScreen;
		}
	}
});

export default = ScreenRouter;
