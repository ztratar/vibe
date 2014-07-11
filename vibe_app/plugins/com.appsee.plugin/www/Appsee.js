/**
 * Appsee.js
 *
 * Cordova Appsee plugin.
 *
 * Author: Yoni Douek
 */

var exec = require('cordova/exec');

var Appsee = function() {};

Appsee.start = function(key, successCallback, errorCallback)
{
	return exec(successCallback, errorCallback, "Appsee", "start", [key]);
};

Appsee.stop = function(successCallback, errorCallback)
{
	return exec(successCallback, errorCallback, "Appsee", "stop", []);
};

Appsee.stopAndUpload = function(successCallback, errorCallback)
{
	return exec(successCallback, errorCallback, "Appsee", "stopAndUpload", []);
};

Appsee.pause = function(successCallback, errorCallback)
{
	return exec(successCallback, errorCallback, "Appsee", "pause", []);
};

Appsee.resume = function(successCallback, errorCallback)
{
	return exec(successCallback, errorCallback, "Appsee", "resume", []);
};

Appsee.addEvent = function(eventName, successCallback, errorCallback)
{
	return exec(successCallback, errorCallback, "Appsee", "addEvent", [eventName]);
};

// Properties should be json: { id:"123", price: 200, location: "Jeruslem"}
Appsee.addEventWithProperties = function(eventName, properties, successCallback, errorCallback)
{
	return exec(successCallback, errorCallback, "Appsee", "addEventWithProperties", [eventName, properties]);
};

Appsee.startScreen = function(screenName, successCallback, errorCallback)
{
	return exec(successCallback, errorCallback, "Appsee", "startScreen", [screenName]);
};

Appsee.setUserId = function(userId, successCallback, errorCallback)
{
	return exec(successCallback, errorCallback, "Appsee", "setUserId", [userId]);
};

Appsee.setLocation = function(latitude, longitude, horizontalAccuracy, verticalAccuracy, successCallback, errorCallback)
{
	return exec(successCallback, errorCallback, "Appsee", "setLocation", [latitude, longitude, horizontalAccuracy, verticalAccuracy]);
};

Appsee.setLocationDescription = function(locationDescription, successCallback, errorCallback)
{
	return exec(successCallback, errorCallback, "Appsee", "setLocationDescription", [locationDescription]);
};


module.exports = Appsee;
