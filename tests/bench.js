var fs = require('fs');
var suite = require('benchmark').Suite();

var v1 = require('../node_modules/stylecow-parser/lib'); 
var v2 = require('../lib');

var code = fs.readFileSync(__dirname + '/css/1.css', 'utf-8');

suite
	.add('v1', function () {
		v1.Root.create(new v1.Reader(code));
	})
	.add('v2', function () {
		v2.Root.create(v2.Reader.fromString(code));
	})
	.on('cycle', function(event) {
		console.log(String(event.target));
	})
	.on('error', function(error) {
		console.log(error);
	})
	.on('complete', function () {
		console.log('fin');
	})
	.run();
