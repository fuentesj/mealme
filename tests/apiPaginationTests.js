var superagent 	= require("superagent"),
	expect 		= require("expect.js"),
	async 		= require("async");

	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

	var testingHost = "localhost",
		testingPort = "8443",
		testUserName = "admin",
	 	testUserPassword = "abc12345",
		trucksToBePosted = [],
		firstResultSet = null,
		secondResultSet = null
		linkHeaderToSecondResultSet = null;

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

		before("Set up all test data before any tests run", function(done) {

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
						}
						expect(res.status).to.eql(201);
						callback();
					});
				}, function(err) {
					if (err) {
						console.log("An error occurred while POSTing test trucks objects.");
					} else {
						done();
					}
				});
			});


		after("Tear down all test data after all tests have run", function(done) {

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
								firstResultSet = res.body;
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
								secondResultSet = res.body;
								expect(deepCompareArrays(firstResultSet, secondResultSet)).to.eql(false);
								trucksToBePosted = firstResultSet.concat(secondResultSet);
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
