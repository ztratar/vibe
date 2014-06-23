var http = require('http'),
	faye = require('faye'),
	fayeServer = http.createServer(),
	fayeNode = new faye.NodeAdapter({ mount: '/' }),
	fayeClient;

fayeNode.attach(fayeServer);
fayeServer.listen(8000);
console.log('Faye started on port 8000');

exports.send = function(channel, data) {
	if (typeof data.toJSON === 'function') {
		data = data.toJSON();
	}
	for (var key in data) {
		if (data[key]
				&& data[key] instanceof Date) {
			data[key] = data[key].toISOString();
		}
	}
	fayeNode.getClient().publish(channel, data);
};

module.exports = exports;
