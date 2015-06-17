var mongoose 	= require("mongoose");
var Schema 		= mongoose.Schema;

var FoodTruckSchema = new Schema({
	name: {
		type: String, 
		required: true
	},
	last_known_location: {
		type: {
			type: String,
			default: "Point"
		},
		coordinates: [Number]
	},
	openingTime: {type: Date},
	closingTime: {type: Date},
	subscribers: [{ 
		type: Schema.Types.ObjectId,
		ref: "FoodTruckCustomer"
	}]
});

mongoose.model("FoodTruck", FoodTruckSchema);