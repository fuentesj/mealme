module.exports = function(app, passport) {

	var mongoose = require("mongoose")
	var foodTruck = mongoose.model("FoodTruck")

	var resultCountPerPage = 10
	var INTERNAL_ERROR_MSG = "An internal error occurred."


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

		foodTruck.find({"_id": req.query.id}, function(err, truck) {
			if (err) {
				return res.status(500).send(INTERNAL_ERROR_MSG)
			} else {
				return res.send(truck)
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