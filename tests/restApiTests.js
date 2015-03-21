var superagent 	= require('superagent'),
	expect 		= require('expect.js'),
	async		= require('async');

var testingHost = "localhost",
	testingPort = "4242",
 	testTruckName = "Test Truck",
 	testTruckId = null,
 	testTruckLat = 37.7,
 	testTruckLong = -122.4,
 	postedTruckName = "Truck ABC",
 	postedTruckId = null,
 	testCustomerName = "John Doe",
 	testCustomerId = null,
 	postedCustomerName = "Jane Doe",
 	postedCustomerId = null;


describe('truck time rest api server', function(){

	before("Set up test data before any test begins", function(done) {

		async.series([
			function(callback) {
				superagent
					.post("http://" + testingHost + ":" + testingPort + "/customers")
					.send({name: testCustomerName})
					.end(function(err, res) {
						if (err) {
							callback(err);
						}

						testCustomerId = res.body.id;
						callback();
					});
			},
			function(callback) {
				superagent
					.post("http://" + testingHost + ":" + testingPort + "/trucks")
					.send({
						name: testTruckName,
						last_known_location: [testTruckLat, testTruckLong]
					})
					.end(function(err, res) {
						if (err) {
							callback(err);
						}

						testTruckId = res.body.id;
						callback();
					});
			}
		], function (err) {
			if (err) {
				var error = new Error(err);
				console.log(error);
			} else {
				done();
			}
		});
	});

	after("Tear down test data after all tests have finished", function(done) {

		async.series([
			function(callback) {
				superagent
				 	.del("http://" + testingHost + ":" + testingPort + "/trucks/" + testTruckId)
				 	.end(function(err, res) {
				 		if (err) {
				 			callback(err);
				 		}
				 		expect(res.status).to.eql(200);
				 		callback();
				 	});

			},
			function(callback) {
				superagent
				 	.del("http://" + testingHost + ":" + testingPort + "/trucks/" + postedTruckId)
				 	.end(function(err, res) {
				 		if (err) {
				 			callback(err);
				 		}
				 		expect(res.status).to.eql(200);
				 		callback();
				 	});
			},
			function(callback) {
				superagent
					.del("http://" + testingHost + ":" + testingPort + "/customers/" + testCustomerId)
					.end(function(err, res) {
						if (err) {
							callback(err);
						}
						expect(res.status).to.eql(200);
						callback();
					});
			}, 
			function(callback) {
				superagent
					.del("http://" + testingHost + ":" + testingPort + "/customers/" + postedCustomerId)
					.end(function(err, res){
						if (err) {
							callback(err);
						}
						expect(res.status).to.eql(200);
						callback();
					});
			}
		], function(err) {
			if (err) {
				var error = new Error(err);
				console.log(err);
			} else {
				done();
			}
		});
	});


	it('can successfully GET an existing truck', function(done){
		superagent
			.get("http://" + testingHost + ":" + testingPort + "/trucks/" + testTruckId)
			.end(function(err, res){
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
		    .end(function(err, res){
		    	postedTruckId = res.body.id;
		    	expect(res.status).to.eql(201);
		      	done();
			});
	});


	it('can successfully GET a food truck customer', function(done){
		superagent
			.get("http://" + testingHost + ":" + testingPort + "/customers/" + testCustomerId)
			.end(function(err, res) {
				expect(res.body.name).to.eql(testCustomerName);
				done();
				
			});
	});

	
	it('can successfully POST a new food truck customer', function(done){
		superagent	
			.post("http://" + testingHost + ":" + testingPort + "/customers/")
			.send({name: postedCustomerName})
			.end(function(err, res){
				postedCustomerId = res.body.id;
				expect(res.status, 201);
				done();
			});
	});

});