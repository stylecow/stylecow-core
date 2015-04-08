var fs = require('fs');
var suite = require('benchmark').Suite();

var v1 = require('../node_modules/stylecow-parser/lib'); 
var v2 = require('../lib');

var css1 = fs.readFileSync(__dirname + '/bench/facebook.com.css', 'utf-8');
var css2 = fs.readFileSync(__dirname + '/bench/github.com.css', 'utf-8');
var css3 = fs.readFileSync(__dirname + '/bench/twitter.com.css', 'utf-8');
var css4 = fs.readFileSync(__dirname + '/bench/youtube.com.css', 'utf-8');

suite
	.add('v1', function () {
		v1.Root.create(new v1.Reader(css1));
		v1.Root.create(new v1.Reader(css2));
		v1.Root.create(new v1.Reader(css3));
		v1.Root.create(new v1.Reader(css4));
	})
	.add('v2', function () {
		v2.Root.create(v2.Reader.fromString(css1));
		v2.Root.create(v2.Reader.fromString(css2));
		v2.Root.create(v2.Reader.fromString(css3));
		v2.Root.create(v2.Reader.fromString(css4));
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
