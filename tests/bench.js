var fs = require('fs');
var suite = require('benchmark').Suite();

var v1 = require('../node_modules/stylecow-parser/lib'); 
var v2 = require('../lib');

var code = fs.readFileSync(__dirname + '/code.css', 'utf-8');

var results = [];

suite
	.add('v1', function () {
		results[0] = v1.Root.create(new v1.Reader(code));
	})
	.add('v2', function () {
		results[1] = v2.Root.create(v2.Reader.fromString(code));
	})
	.on('cycle', function(event) {
		console.log(String(event.target));
	})
	.on('error', function(error) {
		console.log(error);
	})
	.on('complete', function () {
		console.log(results.join('\n\n'));
	})
	.run();
