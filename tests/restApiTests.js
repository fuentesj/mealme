var superagent 	= require('superagent'),
	expect 		= require('expect.js');

var testingHost = "localhost",
	testingPort = "4242",
 	testTruckName = "Test Truck",
 	testTruckId = null,
 	testTruckLat = 37.7,
 	testTruckLong = -122.4,
 	postedTruckName = "Truck ABC",
 	postedTruckId = null,
 	testCustomerName = "John Doe",
 	testCustomerId = null;


describe('truck time rest api server', function(){

	before(function(done) {
		superagent
			.post("http://" + testingHost + ":" + testingPort + "/trucks")
			.send({
				name: testTruckName,
				last_known_location: [
					testTruckLat,
					testTruckLong
				]
			})
			.end(function(res){
				testTruckId = res.body.id;
			});

		console.log("finished first POST");

		superagent
			.post("http://" + testingHost + ":" + testingPort + "/customers")
			.send({
				name: testCustomerName
			})
			.end(function(res) {
				testCustomerId = res.body.id;
			});

		console.log("finished second POST");

		if (testTruckId && testCustomerId) {
			console.log("neither are null");
		} else {
			console.log("one or both are null");
		}
	});

	after(function(done) {
		superagent
			.del("http://" + testingHost + ":" + testingPort + "/trucks/" + testTruckId)
			.end(function(res) {
				expect(res.status).to.eql(200);
				done();
			});

		superagent
			.del("http://" + testingHost + ":" + testingPort + "/trucks/" + postedTruckId)
			.end(function(res) { 
				expect(res.status).to.eql(200);
				done();
			});
	});


	it('can successfully GET an existing truck', function(done){
		superagent
			.get("http://" + testingHost + ":" + testingPort + "/trucks/" + testTruckId)
			.end(function(res){
				expect(res.body.name).to.eql(testTruckName);
				var lastKnownLocationArray = res.body.last_known_location.split(",");
				expect(lastKnownLocationArray[0]).to.eql(testTruckLat);
				expect(lastKnownLocationArray[1]).to.eql(testTruckLong);
				expect(res.status).to.eql(200);
				done();
			});
	});


	it('can successfully POST a new food truck', function(done){
		superagent
			.post("http://" + testingHost + ":" + testingPort + "/trucks")
			.send({name: postedTruckName})
		    .end(function(res){
		    	postedTruckId = res.body.id;
		    	expect(res.status).to.eql(201);
		      	done();
			});
	});


	it('can successfully GET a food truck customer', function(done){
		console.log("customer id: " + testCustomerId);
		superagent
			.get("http://" + testingHost + ":" + testingPort + "/customers" + testCustomerId)
			.end(function(res) {
				console.log(res.body.id);
				done();
				
			});
	});





});