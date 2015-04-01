var express 		= require("express"),
	app 			= express(),
	passport 		= require("passport"),
	BasicStrategy 	= require('passport-http').BasicStrategy,
	mongoose 		= require("mongoose"),
	fs 				= require("fs"),
	https 			= require('https'),
	http 			= require('http'),
	bodyParser 		= require('body-parser');

mongoose.connect('mongodb://localhost/mealme');

var models = fs.readdirSync('./models');
for (var i = 0; i < models.length; i++) {
	if (models[i].indexOf('.js') === -1) continue;
	require('./models/' + models[i]);
}

var User = mongoose.model('User');

passport.use(new BasicStrategy(
	function(username, password, done) {
		User.findOne({username: username, password: password}, function(err, user) {
			if (err) { return done(err); }
			if (!user) { return done(null, false); }
			return done(null, user);
		});
	}
));

app.use(bodyParser.json());
app.use(passport.initialize());
require('./routes/apiRoutes.js')(app, passport);
https.createServer({
	key: fs.readFileSync('./ssl/key.pem'),
	cert:fs.readFileSync('./ssl/cert.pem'),
}, app).listen(process.env.PORT || 8443);


