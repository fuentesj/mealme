var mongoose 	= require("mongoose");
var Schema 		= mongoose.Schema;

var FoodTruckSchema = new Schema({
	name: {type: String, required: true},
	location: {
		"type": "Point",
		"coordinates": []
	},
	openingTime: {type: Date},
	closingTime: {type: Date}
});

mongoose.model("FoodTruck", FoodTruckSchema);