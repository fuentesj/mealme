var superagent 	= require("superagent"),
	expect 		= require("expect.js"),
	async 		= require("async");

	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

	var testingHost = "localhost",
		testingPort = "8443",
		testUserName = "admin",
	 	testUserPassword = "abc12345",
		trucksToBePosted = [],
		firstTruckResultSet = null,
		secondTruckResultSet = null
		linkHeaderToSecondResultSet = null,
		customersToBePosted = [],
		firstCustomerResultSet = null,
		secondCustomerResultSet = null,
		linkToSecondCustomerResultSet = null;

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


	describe("TruckTime API should use pagination properly", function() {

		before("Set up all truck test data before any tests run", function(done) {

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
						if (err) {
							callback(err);
						} else {
							expect(res.status).to.eql(201);
							callback();
						}
					});
				}, function(err) {
					if (err) {
						console.log("An error occurred while POSTing test trucks objects: " + err);
					} else {
						done();
					}
				});
			});


		before("Set up all customer test data before any tests run", function(done) {

			for (var currentIndex = 0; currentIndex < 20; currentIndex++) {
				var currentCustomerName = "customer" + currentIndex;
				var currentCustomer = {
					name: currentCustomerName
				}
				customersToBePosted.push(currentCustomer);
			}

			async.each(customersToBePosted, function(customer, callback) {
				superagent
					.post("https://" + testingHost + ":" + testingPort + "/customers/")
					.auth(testUserName, testUserPassword)
					.send(customer)
					.end(function(err, res) {
						if (err) {
							callback(err)
						} else {
							expect(res.status).to.eql(201);
							callback();
						}
					});
				}, function(err) {
					if (err) {
						console.log(err)
					} else {
						done();
					}
				});
			});


		after("Tear down all test test data after all tests have run", function(done) {

			async.each(trucksToBePosted, function(truck, callback) {
				superagent
					.del("https://" + testingHost + ":" + testingPort + "/trucks/" + truck._id)
					.auth(testUserName, testUserPassword)
					.end(function(err, res) {
						if (err) {
							callback(err);
						}
						expect(res.status).to.eql(200);
						callback();
					});
				}, function(err) {
					if (err) {
						console.log("An error occurred while deleting test truck objects.");
					} else {
						done();
					}
				});
			});


		after("Tear down all customer test data after all tests have run", function(done) {

			async.each(customersToBePosted, function(customer, callback) {
				superagent
					.del("https://" + testingHost + ":" + testingPort + "/customers/" + customer._id)
					.auth(testUserName, testUserPassword)
					.end(function(err, res) {
						if (err) {
							callback(err);
						}
						expect(res.status).to.eql(200);
						callback();
					});
				}, function(err) {
					if (err) {
						console.log("An error occurred while deleting test customer objects: " + err);
					} else {
						done();
					}
				});
			});


		it("should ensure that making multiple GET requests for trucks returns results with proper pagination", function(done) {

			async.series([
				function(callback) {
					superagent
						.get("https://" + testingHost + ":" + testingPort + "/trucks?pageNumber=0")
						.auth(testUserName, testUserPassword)
						.end(function(err, res) {
							if (err) {
								console.log(err);
							} else {
								var rawHeaderString = res.headers['link'];								
								linkHeaderToSecondResultSet = rawHeaderString.replace(/(<)(\/trucks\?pageNumber=[0-9])(>.*)/, "$2");
								expect(res.status).to.eql(200);
								expect(res.body.length).to.eql(10);
								firstTruckResultSet = res.body;
								callback();
							}
						});
				},
				function(callback) {
					superagent
						.get("https://" + testingHost + ":" + testingPort + linkHeaderToSecondResultSet)
						.auth(testUserName, testUserPassword)
						.end(function(err, res) {
							if (err) {
								console.log(err);
							} else {
								expect(res.status).to.eql(200);
								expect(res.body.length).to.eql(10);
								secondTruckResultSet = res.body;
								expect(deepCompareArrays(firstTruckResultSet, secondTruckResultSet)).to.eql(false);
								trucksToBePosted = firstTruckResultSet.concat(secondTruckResultSet);
								callback();
							}
						});
					}], function(err) {
						if (err) {
							console.log(err);
						}
						done();
					});
			});


		it("should ensure that making multiple GET requests for customers returns results with proper pagination", function(done) {
			async.series([
				function(callback) {
					superagent
						.get("https://" + testingHost + ":" + testingPort + "/customers?pageNumber=0")
						.auth(testUserName, testUserPassword)
						.end(function(err, res) {
							if (err) {
								console.log(err);
							} else {
								var rawHeaderString = res.headers['link'];								
								linkToSecondCustomerResultSet = rawHeaderString.replace(/(<)(\/customers\?pageNumber=[0-9])(>.*)/, "$2");
								expect(res.status).to.eql(200);
								expect(res.body.length).to.eql(10);
								firstCustomerResultSet = res.body;
								callback();
							}
						});
				},
				function(callback) {
					superagent
						.get("https://" + testingHost + ":" + testingPort + linkToSecondCustomerResultSet)
						.auth(testUserName, testUserPassword)
						.end(function(err, res) {
							if (err) {
								console.log(err);
							} else {
								expect(res.status).to.eql(200);
								expect(res.body.length).to.eql(10);
								secondCustomerResultSet = res.body;
								expect(deepCompareArrays(firstCustomerResultSet, secondCustomerResultSet)).to.eql(false);
								customersToBePosted = firstCustomerResultSet.concat(secondCustomerResultSet);
								callback();
							}
						});
				}], function(err) {
					if (err) {
						console.log(err);
					}
					done();
				});
			});

	});