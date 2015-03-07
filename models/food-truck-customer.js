var mongoose	= require('mongoose');
var Schema 		= mongoose.Schema;

var FoodTruckCustomerSchema = new Schema({
	name: {type: String, required: true},
	current_location: {
  		longitude: Number,
  		latitude: Number
	},
	//truck_subscriptions: [{ type: ObjectId, ref: 'FoodTruck'}]
});

mongoose.model("FoodTruckCustomer", FoodTruckCustomerSchema);