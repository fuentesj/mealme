var OAuth = require('oauth');
var oauth = new OAuth.OAuth(
		process.env.TWITTER_OAUTH_REQUEST_TOKEN_URL,
		process.env.TWITTER_OAUTH_ACCESS_TOKEN_URL,
		process.env.TWITTER_OAUTH_REQUEST_TOKEN_VALUE,
		process.env.TWITTER_OAUTH_ACCESS_TOKEN_VALUE,
		'1.0A',
		null,
		'HMAC-SHA1'
	);

	oauth.get(
		process.env.TWITTER_BURNT_TRUCK_API_URL,
		process.env.TWITTER_API_ACCESS_TOKEN,
		process.env.TWITTER_API_TOKEN_SECRET,
		function(e, data, res) {
			if (e) console.error(e);
			var json_data = JSON.parse(data)[0];
			console.log(json_data["text"]);
		});