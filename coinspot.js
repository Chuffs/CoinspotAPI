var hmac = require("crypto").createHmac,
	https = require('https');

function coinspot(key, secret) {
  	var self = this;
  	self.key = key;
  	self.secret = secret;

	//POST Request
	var POSTrequest = function(path, postdata, callback) {
		var nonce = new Date().getTime();

		var postdata = postdata || {};
		postdata.nonce = nonce;

		var stringmessage = JSON.stringify(postdata);
		var signedMessage = new hmac("sha512", self.secret);

		signedMessage.update(stringmessage);

		var sign = signedMessage.digest('hex');

		var options = {
			rejectUnauthorized: false,
			method: 'POST',
			host: 'www.coinspot.com.au',
			port: 443,
			path: path,
			headers: {
				'Content-Type': 'application/json',
				'sign': sign,
				'key': self.key
			}
		};

		var req = https.request(options, function(resp){
			var data = '';
			resp.on('data', function(chunk){
				data += chunk;
			});
			resp.on('end', function(chunk){
				callback(null, data);
			});
		}).on("error", function(e){
			callback(e, data);
		});

		req.write(stringmessage);
		req.end();
	}
	//GET Request
	var GETrequest = function(path, postdata, callback) {
		var nonce = new Date().getTime();

		var postdata = postdata || {};
		postdata.nonce = nonce;

		var stringmessage = JSON.stringify(postdata);
		var signedMessage = new hmac("sha512", self.secret);

		signedMessage.update(stringmessage);

		var sign = signedMessage.digest('hex');

		var options = {
			rejectUnauthorized: false,
			method: 'GET',
			host: 'www.coinspot.com.au',
			port: 443,
			path: path,
			headers: {
				'Content-Type': 'application/json',
				'sign': sign,
				'key': self.key
			}
		};

		var req = https.request(options, function(resp){
			var data = '';
			resp.on('data', function(chunk){
				data += chunk;
			});
			resp.on('end', function(chunk){
				callback(null, data);
			});
		}).on("error", function(e){
			callback(e, data);
		});

		req.write(stringmessage);
		req.end();
	}

	self.singlebalance = function(cointype, callback) {
		POSTrequest(`/api/ro/my/balance/${cointype}`, {}, callback);
	}

	self.singlePrice = function(cointype, callback) {
		GETrequest(`/pubapi/v2/latest/${cointype}`, {}, callback);
	}

	self.sellNowQuote = function(cointype, amount, amounttype, callback) {
		var data = {cointype:cointype, amount:amount, amounttype:amounttype}
		POSTrequest(`/api/v2/quote/sell/now/`, data, callback);
	}
}

module.exports = coinspot;
