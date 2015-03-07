 var mongoose 	= require("mongoose");
 var Schema 	= mongoose.Schema;

 var FoodTruckSchema = new Schema({
 	name: {type: String, required: true},
 	current_location: {
 		longitude: Number,
 		latitude: Number
 	},
 	openingTime: {type: Date},
 	closingTime: {type: Date},
 	//subscribers: [{ type: ObjectId, ref: 'FoodTruckCustomer'}]
 });

 mongoose.model("FoodTruck", FoodTruckSchema);