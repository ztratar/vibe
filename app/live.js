var _ = require('underscore'),
	faye = require('faye'),
	server,
	fayeNode,
	port = process.env.PORT || 8000,
	fayeClient;

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
	fayeNode = new faye.NodeAdapter({
		mount: '/faye'
	});
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
