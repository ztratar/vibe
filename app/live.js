var _ = require('underscore'),
	faye = require('faye'),
	redis = require('faye-redis'),
	server,
	fayeNode,
	port = process.env.PORT || 8000,
	fayeClient,
	rtg;

if (process.env.REDISTOGO_URL) {
	rtg = require("url").parse(process.env.REDISTOGO_URL);
}

// Date objects aren't sent properly over faye
// unless converted to strings first. Some objects
// have nested dates, such as Questions with populated
// answers.
var recurseFormatDates = function(inputObj) {
	if (typeof inputObj.toObject === 'function') {
		inputObj = inputObj.toObject();
	}

	for (var key in inputObj) {
		if (inputObj[key]
				&& inputObj[key] instanceof Date) {
			inputObj[key] = inputObj[key].toISOString();
		} else if (_.isObject(inputObj[key])
				&& !(inputObj[key] instanceof Buffer)
				&& Object.keys(inputObj[key]).length) {
			inputObj[key] = recurseFormatDates(inputObj[key]);
		}
	}

	return inputObj;
};

exports.start = function() {
	var nodeAdapterOpts = {
		mount: '/faye',
		timeout: 40
	};

	if (rtg) {
		nodeAdapterOpts.engine = {
			type: redis,
			host: rtg.hostname,
			port: rtg.port,
			password: rtg.auth.split(":")[1]
		};
	}

	fayeNode = new faye.NodeAdapter(nodeAdapterOpts);
	fayeNode.attach(server);
};

exports.send = function(channel, data) {
	if (typeof data.toJSON === 'function') {
		data = data.toJSON();
	}

	data = recurseFormatDates(data);

	fayeNode.getClient().publish(channel, data);
};

// Cache the app
module.exports = function(exportedServer) {
	if (exportedServer) {
		server = exportedServer;
		exports.start();
	}
	return exports;
};
