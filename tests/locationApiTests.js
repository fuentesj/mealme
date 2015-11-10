var superagent 	= require("superagent"),
	expect 		= require("expect.js"),
	async 		= require("async");


var testingHost = "localhost",
	testingPost = "8443";


var orangeCountyTruck = {
	name: "orangeCountyTruck",
	last_known_location: {
		coordinates: [33.787804, -117.852889]
	}
};


var losAngelesTruck = {
	name: "losAngelesTruck",
	last_known_location: {
		coordinates: [34.053972, -118.243447]	
	}
};


var sanDiegoTruck = {
	name: "sanDiegoTruck",
	last_known_location: {
		coordinates: [32.719406, -117.153793]
	}
};

var trucksArrays = [];
trucksArrays.push(orangeCountyTruck);
trucksArrays.push(losAngelesTruck);
trucksArrays.push(sanDiegoTruck);




	describe("TruckTime REST API should return closest results given a location and a max radius", function() {

		before("Set up test trucks before running tests", function() {

			async.each(trucksArrays, function(truck, callback) {
				superagent
					.post()
					.auth()
					.send()
					.end(function(err, res) {
						
				});
			});
		});
	});