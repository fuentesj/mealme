var mongoose	= require('mongoose');
var Schema 		= mongoose.Schema;

var FoodTruckCustomerSchema = new Schema({
	name: {type: String, required, true},
	location: {
		"type": "Point",
		"coordinates": []
	}
});

mongoose.model("FoodTruckCustomer", FoodTruckCustomerSchema);