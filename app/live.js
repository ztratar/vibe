var http = require('http'),
	faye = require('faye'),
	fayeServer = http.createServer(),
	fayeNode = new faye.NodeAdapter({ mount: '/' });

fayeNode.attach(fayeServer);
fayeServer.listen(8000);
console.log('Faye started on port 8000');

exports.send = function(channel, data) {
	fayeNode.getClient().publish(channel, data);
};

module.exports = exports;
