var express 	= require("express"),
	app 		= express(),
	passport 	= require("passport"),
	mongoose 	= require("mongoose"),
	fs 			= require("fs"),
	https 		= require('https'),
	http 		= require('http'),
	bodyParser 	= require('body-parser');

mongoose.connect('mongodb://localhost/mealme');

var models = fs.readdirSync('./models');
for (var i = 0; i < models.length; i++) {
	if (models[i].indexOf('.js') === -1) continue;
	require('./models/' + models[i]);
}

app.use(bodyParser.json());
require('./routes/apiRoutes.js')(app, passport);
http.createServer(app).listen(8888);
https.createServer({
	key: fs.readFileSync('./ssl/key.pem'),
	cert:fs.readFileSync('./ssl/cert.pem'),
}, app).listen(8443);


