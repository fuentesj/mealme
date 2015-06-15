var mongoose	= require("mongoose");
var Schema 		= mongoose.Schema;

var FoodTruckCustomerSchema = new Schema({
	name: {type: String, required: true},
	last_known_location: {
		type: {
			type: String,
			default: "Point"
		},
		coordinates: [Number]
	},
	truck_subscriptions: [{
		type: Schema.Types.ObjectId,
		ref: "FoodTruck"
	}]
});

mongoose.model("FoodTruckCustomer", FoodTruckCustomerSchema);