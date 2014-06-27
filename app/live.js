var _ = require('underscore'),
	http = require('http'),
	faye = require('faye'),
	fayeServer = http.createServer(),
	fayeNode = new faye.NodeAdapter({ mount: '/' }),
	fayeClient;

fayeNode.attach(fayeServer);
var port = 8000;
fayeServer.listen(port);
console.log('Faye started on port ' + port);

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

exports.send = function(channel, data) {
	if (typeof data.toJSON === 'function') {
		data = data.toJSON();
	}

	data = recurseFormatDates(data);

	fayeNode.getClient().publish(channel, data);
};

module.exports = exports;
