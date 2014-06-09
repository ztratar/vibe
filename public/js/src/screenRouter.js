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
	initCurrentScreen: function() {
		this.currentScreen = $('.screen.current');
		this.setScreenContainer();
	},
	setScreenContainer: function() {
		this.currentScreenContainer = $('<div class="container"></div>');
		this.currentScreen.html(this.currentScreenContainer);
	},
	createNewScreen: function(screenSize) {
		// If a screen has current when the animation
		// is called, it should be entering the screen.
		// Else, it is leaving the screen.
		if (this.currentScreen) {
			this.removeOldScreen();
			this.oldScreen = this.currentScreen;
			this.oldScreenSize = this.screenSize;
		}

		this.screenSize = screenSize || 'std';

		this.currentScreen = $('<div class="screen new '+this.screenSize+'"></div>');
		this.currentScreen.appendTo($('body'));
		this.setScreenContainer();

		this.animateScreens('');

		_.delay(_.bind(this.removeOldScreen, this), 3000);

		return this.currentScreen;
	},
	animateScreens: function(animation) {
		var animationClass = '';
		if (animation && animation.length) {
			animationClass = 'animate-' + animation;
		}

		this.currentScreen.addClass(animationClass);

		_.delay(_.bind(function() {
			if (this.oldScreen) {
				this.oldScreen.attr('class', ['screen', 'old', animationClass, this.oldScreenSize].join(' '));
			}
			this.currentScreen.attr('class', ['screen', 'current', animationClass, this.screenSize].join(' '));
		}, this), 20);
	},
	removeOldScreen: function() {
		if (this.oldScreen) {
			this.oldScreen.remove();
			delete this.oldScreen;
		}
	}
});

export default = ScreenRouter;
