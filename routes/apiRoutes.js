module.exports = function(app, passport) {

	var mongoose = require("mongoose")
	var FoodTruck = mongoose.model("FoodTruck")

	var resultCountPerPage = 10
	var INTERNAL_ERROR_MSG = "An internal error occurred."
	var RESOURCE_CREATED_MSG = "Resource successfully created."


	app.get("/trucks", function(req, res) {

		foodTruck.find({}, {}, {limit: resultCountPerPage, skip: (req.query.pageNumber > 0 ? resultCountPerPage : 0 )}, function(err, truckCollection) {
			if (err) {
				return res.status(500).send(INTERNAL_ERROR_MSG)
			} else {
				return res.send(truckCollection)
			}
		})
	})



	app.get("/trucks/:id", function(req, res) {

		foodTruck.find({"_id": req.param("id")}, function(err, truck) {
			if (err) {
				return res.status(500).send(INTERNAL_ERROR_MSG)
			} else {
				return res.send(truck)
			}
		})
	})


	app.post("/trucks", function(req, res){

		var foodTruck = new FoodTruck(req.body)
		foodTruck.save(function(err) {
			if (err) {
				return res.status(500).send(INTERNAL_ERROR_MSG)
			} else {
				return res.status(201).send(RESOURCE_CREATED_MSG)
			}
		})

	})



	app.get("/trucks/:id/menu", function(req, res) {

	})



	app.get("/trucks/:id/subscribers", function(req, res) {

	})



	app.get("/customers", function(req, res) {

	})



	app.get("/customers/:id", function(req, res) {

	})



	app.get("/customers/:id/subscriptions", function(req, res) {

	})
	
}