var express 	= require("express"),
	app 		= express(),
	passport 	= require("passport"),
	mongoose 	= require("mongoose"),
	fs 			= require("fs"),
	bodyParser 	= require('body-parser')

mongoose.connect('mongodb://localhost/mealme');

var models = fs.readdirSync('./models');
for (var i = 0; i < models.length; i++) {
	if (models[i].indexOf('.js') === -1) continue;
	require('./models/' + models[i])
}

app.use(bodyParser.json())

require('./routes/apiRoutes.js')(app, passport)

app.listen(4242)