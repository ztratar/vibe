var pushNotification = window.plugins ? window.plugins.pushNotification : undefined,
	devicePlatform = window.cordova ? window.cordova.platformId : undefined,
	registerCallback;

var pushNotificationHelper = {

	register: function(cb) {
		if (!window.isCordova) return;

		registerCallback = cb;

		if (devicePlatform == 'android' || devicePlatform == 'Android' || devicePlatform == "amazon-fireos" ){
			pushNotification.register(
				function() {
					cb && cb();
				},
				function(err) {
					cb && cb();
				},
				{
					'senderID': '217202406384',
					'ecb': 'pushCallbacks.onNotificationAndroid'
				}
			);
		} else {
			pushNotification.register(
				function(result) {
					window.Vibe.user.saveDeviceInfo('ios', result);
					cb && cb();
				},
				function(err) {
					cb && cb();
				},
				{
					"badge": "true",
					"sound": "true",
					"alert": "false",
					"ecb":"pushCallbacks.onNotificationIOS"
				}
			);
		}
	}

};

window.pushCallbacks = {};

window.pushCallbacks.onNotificationIOS = function(event) {
	if (event.sound) {
		var snd = new Media(event.sound);
		snd.play();
	}

	if (event.badge) {
		pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
	}
};

window.pushCallbacks.onNotificationAndroid = function(e) {
	if (e.event === 'registered') {
		window.Vibe.user.saveDeviceInfo('android', e.regid);
	} else if (e.event === 'message') {
		if (e.foreground) {
			var soundfile = e.soundname || e.payload.sound,
				my_media = new Media("/android_asset/www/"+ soundfile);

			my_media.play();
		}
	}
};

export default = pushNotificationHelper;
