var qs = require('querystring'),
	ParseAPI = require('node-parse-api'),
	Parse = ParseAPI.Parse,
	parseApp = new Parse('wKLFQwfrUOHY7DeJefZ7Wx3H9Jzrc0mX2eNdBMeX', 'yEDca6g7VODPX6PopDoBKtOzBiSmt9BpysTuHXpz');

qs.escape = function(q){ return q; };

var parseController = {

	app: parseApp,

	getInstallationForDeviceToken: function(deviceToken, callback) {
		var data = {
				where: {
					deviceToken: deviceToken
				}
			};
		parseRequest.call(ParseAPI, 'GET', '/1/installations', data, callback);
	},

	insertOrUpdateInstallationDataWithChannels: function(deviceType, deviceToken, channels, callback) {
		var data;

		// Check for installation
		parseController.getInstallationForDeviceToken(deviceToken, function(result) {
			if (result.length) {
				// Installation exists. Update it
				parseRequest.call(ParseAPI, 'PUT', '/1/installations/' + result[0].objectId, {
					channels: channels
				}, callback);

				return;
			}

			parseApp.insertInstallationDataWithChannels(deviceType, deviceToken, channels, callback);
		});
	}

};

// Parse.com https api request
// Stoeln from node-parse-api... gross
function parseRequest(method, path, data, callback, contentType) {
	var auth = 'Basic ' + new Buffer(this._application_id + ':' + this._master_key).toString('base64');
	var headers = {
		Authorization: auth,
		Connection: 'Keep-alive'
	};

	var body = null;

	switch (method) {
		case 'GET':
			if (data) {
				path += '?' + qs.stringify(data);
			}
			break;
		case 'POST':
			body = typeof data === 'object' ? JSON.stringify(data) : data;
			headers['Content-length'] = Buffer.byteLength(body);
		case 'PUT':
			body = typeof data === 'object' ? JSON.stringify(data) : data;
			headers['Content-length'] = Buffer.byteLength(body);
			headers['Content-type'] = contentType || 'application/json';
			break;
		case 'DELETE':
			headers['Content-length'] = 0;
			break;
		default:
			throw new Error('Unknown method, "' + method + '"');
	}

	var options = {
		host: this._api_host,
		port: this._api_port,
		headers: headers,
		path: path,
		method: method
	};

	var req = this._api_protocol.request(options, function (res) {
		if (!callback) {
			return;
		}

		if (res.statusCode < 200 || res.statusCode >= 300) {
			var err = new Error('HTTP error ' + res.statusCode);
			err.arguments = arguments;
			err.type = res.statusCode;
			err.options = options;
			err.body = body;
			return callback(err);
		}

		// if ((!err) && (res.statusCode === 200 || res.statusCode === 201)) {
		//	 res.success = res.statusCode;
		// }

		var json = '';
		res.setEncoding('utf8');

		res.on('data', function (chunk) {
			json += chunk;
		});

		res.on('end', function () {
			var err = null;
			var data = null;
			try {
				var data = JSON.parse(json);
			} catch (err) {
			}
			callback(err, data);
		});

		res.on('close', function (err) {
			callback(err);
		});
	});

	body && req.write(body, contentType ? 'binary' : 'utf8');
	req.end();

	req.on('error', function (err) {
		callback && callback(err);
	});
}

// Cache the app and passport
module.exports = parseController;
