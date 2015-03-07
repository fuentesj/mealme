var superagent = require('superagent')
var expect = require('expect.js')

var testingHost = "localhost"
var testingPort = "4242"
var testTruckName = "Test Truck"
var testTruckId = null

describe('truck time rest api server', function(){


	before(function(done) {
		superagent
			.post("http://" + testingHost + ":" + testingPort + "/trucks")
			.send({name: testTruckName})
			.end(function(res){
				testTruckId = res.body.id
				done()
			})
	})


	it('can successfully GET an existing truck', function(done){
		superagent
			.get("http://" + testingHost + ":" + testingPort + "/trucks/" + testTruckId)
			.end(function(res){
				expect(res.status).to.eql(200);
				done()
			})
	})


	it('can successfully POST a new food truck', function(done){
		superagent
			.post("http://" + testingHost + ":" + testingPort + "/trucks")
			.send({name: "Truck c"})
		    .end(function(res){
		    	expect(res.status).to.eql(201)
		      	done()
			 })
	})


})