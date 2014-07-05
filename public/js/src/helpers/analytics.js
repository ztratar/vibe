var Analytics = {

	isOn: function() {
		return (typeof window.ga !== 'undefined');
	},

	log: function(opts) {
		if (!Analytics.isOn()) return false;
		if (!opts) return false;

		opts = _.extend({
			'hitType': 'event',
			'eventCategory': '',
			'eventAction': '',
			'eventLabel': undefined,
			'eventValue': undefined
		}, opts);

		window.ga('send', opts);
	}

};

export default = Analytics;
