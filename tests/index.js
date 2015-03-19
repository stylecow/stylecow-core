var stylecow = require(__dirname + '/../lib');
var fs = require('fs');
var assert = require('assert');

[1, 2].forEach(function (num) {
	var code = stylecow.Reader.readFile(__dirname + '/cases/' + num + '.css');
	var css = stylecow.Root.create(code);
	var expected = fs.readFileSync(__dirname + '/expected/' + num + '.css', 'utf8');

	assert.equal(css.toString(), expected);
});
