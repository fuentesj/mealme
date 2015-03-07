var superagent = require('superagent')
var expect = require('expect.js')

var testingHost = "localhost"
var testingPort = "4242"


describe('truck time rest api server', function(){

	it('POSTs a new food truck', function(done){
		superagent
			.post('http://' + testingHost + ":" + testingPort + "/trucks")
			.send({name: "Truck c"})
		    .end(function(res){
		    	expect(res.status).to.eql(201)
		      	done()
			 })
	})

})