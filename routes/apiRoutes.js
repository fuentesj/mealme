module.exports = function(app, passport) {

	var mongoose = require("mongoose");
	var FoodTruck = mongoose.model("FoodTruck");

	var resultCountPerPage = 10;
	var INTERNAL_ERROR_MSG = "An internal error occurred.";

	app.get("/trucks", function(req, res) {

		FoodTruck.find({}, {}, {limit: resultCountPerPage, skip: (req.query.pageNumber > 0 ? resultCountPerPage : 0 )}, function(err, truckCollection) {
			if (err) {
				return res.status(500).send(INTERNAL_ERROR_MSG);
			} else {
				return res.status(200).send(truckCollection);
			}
		});
	});


	app.get("/trucks/:id", function(req, res) {

		FoodTruck.find({"_id": req.param("id")}, function(err, truck) {
			if (err) {
				return res.status(500).send(INTERNAL_ERROR_MSG);
			} else {
				return res.type('json').status(200).send(truck[0]);
			}
		});
	});


	app.post("/trucks", function(req, res){

		var foodTruck = new FoodTruck(req.body);
		foodTruck.save(function(err, foodTruck) {
			if (err) {
				return res.status(500).send(INTERNAL_ERROR_MSG);
			} else {
				return res.status(201).json({id: foodTruck.id});
			}
		});
	});



	app.get("/trucks/:id/menu", function(req, res) {

	});



	app.get("/trucks/:id/subscribers", function(req, res) {

	});



	app.get("/customers", function(req, res) {

	});



	app.get("/customers/:id", function(req, res) {

	});



	app.get("/customers/:id/subscriptions", function(req, res) {

	});
	
};