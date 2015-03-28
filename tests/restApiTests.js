var superagent 	= require('superagent'),
	expect 		= require('expect.js'),
	async		= require('async');

var testingHost = "localhost",
	testingPort = "8443",
 	testTruckName = "Test Truck",
 	testTruckId = null,
 	testTruckLat = 37.7,
 	testTruckLong = -122.4,
 	postedTruckName = "Truck ABC",
 	postedTruckId = null,
 	testCustomerName = "John Doe",
 	testCustomerId = null,
 	postedCustomerName = "Jane Doe",
 	postedCustomerId = null,
 	testUserName = "admin",
 	testUserPassword = "abc12345",
 	subscribedTruckId = null,
 	subscribedTruckName = "subscribedTruck1",
 	customerWithMultipleSubscriptionsId = null,
 	truckWithSubscribersId = null,
 	subscribedCustomerName = "subscribedCustomerName",
 	subscribedCustomerId = null,
	trucksToBePosted = [];
 	

 	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


 var deepCompareArrays = function(firstArray, secondArray) {
 	for (var firstArrayIndex = 0; firstArrayIndex < firstArray.length; firstArrayIndex++) {
 		var thisObject = firstArray[firstArrayIndex];
 		var thisObjectKeys = Object.keys(thisObject);
 		for (var thisObjectKey in thisObjectKeys) {
 			for (var secondArrayIndex = 0; secondArrayIndex < secondArray.length; secondArrayIndex++) {
 				var thatObject = secondArray[secondArrayIndex];
 				var thatObjectKeys = Object.keys(thatObject);
 				for (var thatObjectKey in thatObjectKeys) {
 					if (thisObject[thisObjectKey] !== [thatObject.thatObjectKey]) {
 						return false;
 					}
 				}
 			}
 		}
 	}
 	return true;
 };


describe('truck time rest api server', function() {


	before("Set up test data before any test begins", function(done) {

		async.series([
			function(callback) {
				superagent
					.post("https://" + testingHost + ":" + testingPort + "/customers")
					.auth(testUserName, testUserPassword)
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
					.post("https://" + testingHost + ":" + testingPort + "/trucks")
					.auth(testUserName, testUserPassword)
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
			},
			function(callback) {
				superagent	
					.post("https://" + testingHost + ":" + testingPort + "/trucks")
					.auth(testUserName, testUserPassword)
					.send({name: subscribedTruckName})
					.end(function(err, res) {
						if (err) {
							callback(err);
						}
						subscribedTruckId = res.body.id;
						callback();
					});
			},
			function(callback) {
				superagent
					.post("https://" + testingHost + ":" + testingPort + "/customers")
					.auth(testUserName, testUserPassword)
					.send({name: subscribedCustomerName})
					.end(function(err, res) {
						if (err) {
							callback(err);
						} else {
							subscribedCustomerId = res.body.id;
							callback();
						}
					});
			}
		], function(err) {
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
				 	.del("https://" + testingHost + ":" + testingPort + "/trucks/" + testTruckId)
				 	.auth(testUserName, testUserPassword)
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
				 	.del("https://" + testingHost + ":" + testingPort + "/trucks/" + postedTruckId)
				 	.auth(testUserName, testUserPassword)
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
					.del("https://" + testingHost + ":" + testingPort + "/customers/" + testCustomerId)
					.auth(testUserName, testUserPassword)
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
					.del("https://" + testingHost + ":" + testingPort + "/customers/" + postedCustomerId)
					.auth(testUserName, testUserPassword)
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
					.del("https://" + testingHost + ":" + testingPort + "/customers/" + customerWithMultipleSubscriptionsId)
					.auth(testUserName, testUserPassword)
					.end(function(err, res) {
						if (err){
							callback(err);
						} else {
							expect(res.status).to.eql(200);
							callback();
						}
					});
			},
			function(callback){
				superagent
					.del("https://" + testingHost + ":" + testingPort + "/trucks/" + subscribedTruckId)
					.auth(testUserName, testUserPassword)
					.end(function(err, res) {
						if (err){
							callback(err);
						} else {
							expect(res.status).to.eql(200);
							callback();
						}
					});
			},
			function(callback) {
				superagent
					.del("https://" + testingHost + ":" + testingPort + "/trucks/" + truckWithSubscribersId)
					.auth(testUserName, testUserPassword)
					.end(function(err, res) {
						if (err) {
							callback(err);
						} else {
							expect(res.status).to.eql(200);
							callback();
						}
					});
			},
			function(callback) {
				superagent
					.del("https://" + testingHost + ":" + testingPort + "/customers/" + subscribedCustomerId)
					.auth(testUserName, testUserPassword)
					.end(function(err, res) {
						if (err) {
							callback(err);
						} else {
							expect(res.status).to.eql(200);
							callback();
						}
					});
			},
			function(callback) {
				async.each(trucksToBePosted, function(currentTruck){
					console.log("delete truck with this id: " + JSON.stringify(currentTruck));
					superagent
						.del("https://" + testingHost + ":" + testingPort + "/trucks/" + currentTruck.id)
						.auth(testUserName, testUserPassword)
						.end(function(err, res) {
							if (err) {
								callback(err);
							} else {
								expect(res.status).to.eql(200);
								callback();
							}
						});
					}, function(err) {
						if (err) {
							console.log(err);
						}	

					});
				callback();
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
			.get("https://" + testingHost + ":" + testingPort + "/trucks/" + testTruckId)
			.auth(testUserName, testUserPassword)
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
			.post("https://" + testingHost + ":" + testingPort + "/trucks")
			.auth(testUserName, testUserPassword)
			.send({name: postedTruckName})
		    .end(function(err, res){
		    	postedTruckId = res.body.id;
		    	expect(res.status).to.eql(201);
		      	done();
			});
	});


	it('can successfully GET a food truck customer', function(done){
		superagent
			.get("https://" + testingHost + ":" + testingPort + "/customers/" + testCustomerId)
			.auth(testUserName, testUserPassword)
			.end(function(err, res) {
				expect(res.body.name).to.eql(testCustomerName);
				done();
			});
	});

	
	it('can successfully POST a new food truck customer', function(done){
		superagent	
			.post("https://" + testingHost + ":" + testingPort + "/customers/")
			.auth(testUserName, testUserPassword)
			.send({name: postedCustomerName})
			.end(function(err, res){
				postedCustomerId = res.body.id;
				expect(res.status).to.eql(201);
				done();
			});
	});


	xit('can successfully stop an unauthorized user from making a API call', function(done){
		superagent
			.get('https://' + testingHost + ":" + testingPort + "/customers/")
			.auth('fakeUser', 'fakePassword')
			.end(function(err, res){
				expect(res.status).to.eql(403);
				done();
			});
	});


	it('can successfully POST and GET a Customer with multiple food truck subcriptions', function(done){

		var subcriptions = [];
		subcriptions.push(subscribedTruckId);
		var customerWithSubscriptionsName = "Subscriptions Customer";
		var customerWithSubscriptions = {
			name: customerWithSubscriptionsName,
			truck_subscriptions: subcriptions
		};

		async.series([
			function(callback){
				superagent
					.post("https://" + testingHost + ":" + testingPort + "/customers/")
					.auth(testUserName, testUserPassword)
					.send(customerWithSubscriptions)
					.end(function(err, res){
						if (err) {
							callback(err);
						} else {
							customerWithMultipleSubscriptionsId = res.body.id;
							expect(res.status).to.eql(201);
							callback();
						}
					});
			}, 
			function(callback){
				superagent
					.get("https://" + testingHost + ":" + testingPort + "/customers/" + customerWithMultipleSubscriptionsId)
					.auth(testUserName, testUserPassword)
					.end(function(err, res){
						if (err) {
							callback(err);
						} else {
							expect(res.body.truck_subscriptions[0]._id).to.eql(subscribedTruckId);
							expect(res.body.truck_subscriptions[0].name).to.eql(subscribedTruckName);
							callback();
						}
					});
			}
		], function(err) {
				if (err) {
					console.log(err);
				} else {
					done();
				}
		});

	});


	it('can successfully POST and GET a Food Truck with multiple subscribers', function(done){

		var subscribedCustomers = [];
		subscribedCustomers.push(subscribedCustomerId);
		var truckWithSubscribersName = "truckWithSubscribersName";
		var truckWithSubscribers = {
			name: truckWithSubscribersName,
			subscribers: subscribedCustomers
		};


		async.series([
			function(callback) {
				superagent
					.post("https://" + testingHost + ":" + testingPort + "/trucks")
					.auth(testUserName, testUserPassword)
					.send(truckWithSubscribers)
					.end(function(err, res) {
						if (err) {
							callback(err);
						} else {
							expect(res.status).to.eql(201);
							truckWithSubscribersId = res.body.id;
							callback();
						}
					});
			},
			function(callback) {
				superagent
					.get("https://" + testingHost + ":" + testingPort + "/trucks/" + truckWithSubscribersId)
					.auth(testUserName, testUserPassword)
					.end(function(err, res) {
						if(err) {
							console.log(err);
							callback(err);
						} else {
							expect(res.status).to.eql(200);
							expect(res.body.name).to.eql("truckWithSubscribersName");
							expect(res.body.subscribers[0].name).to.equal("subscribedCustomerName");
							callback();
						}
					});

			 }
		], function(err) {
			if (err) {
				console.log(err);
			} else {
				done();
			}

		});
	});



	it('can successfully receive paginated results from the REST API', function(done) {

		for (var currentIndex = 0; currentIndex < 20; currentIndex++) {
			var currentTruckName = "truck" + currentIndex;
			var currentTruck = {
				name: currentTruckName
			};
			trucksToBePosted.push(currentTruck);
		}

		async.each(trucksToBePosted, function(truck, callback) {
			superagent
				.post("https://" + testingHost + ":" + testingPort + "/trucks/")
				.auth(testUserName, testUserPassword)
				.send(truck)
				.end(function(err, res) {
					expect(res.status).to.eql(201);
					callback();
				});
		}, function(err) {
			if (err) {
				console.log("An error occurred while POSTing test trucks.");
			} 
		});

		

		var firstResultSet = null;
		var secondResultSet = null;

		async.series([
			function(callback) {
				superagent
					.get("https://" + testingHost + ":" + testingPort + "/trucks?pageNumber=0")
					.auth(testUserName, testUserPassword)
					.end(function(err, res) {
						if (err) {
							console.log("An error occurred while getting the first page of results.");
						} else {
							expect(res.body.length).to.eql(10);
							firstResultSet = res.body;
							callback();
						}
					});
			},
			function(callback) {
				superagent
					.get("https://" + testingHost + ":" + testingPort + "/trucks?pageNumber=1")
					.auth(testUserName, testUserPassword)
					.end(function(err, res){
						if (err) { 
							console.log(err);
						} else {
							expect(res.body.length).to.eql(10);
							secondResultSet = res.body;
							expect(deepCompareArrays(firstResultSet, secondResultSet)).to.eql(false);
							expect(deepCompareArrays(secondResultSet, firstResultSet)).to.eql(false);
							callback();
						}
					});
			}
		], function(err) {
			if (err) {
				console.log(err);
			}
			trucksToBePosted = firstResultSet.concat(secondResultSet);
			done();
		});

	});



















});