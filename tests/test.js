var stylecow = require(__dirname + '/../lib');
var fs = require('fs');
var assert = require('assert');

var code = stylecow.Reader.readFile(__dirname + '/cases/1.css');
var css = stylecow.Root.create(code);
var expected = fs.readFileSync(__dirname + '/expected/1.css', 'utf8');

assert.equal(css.toString(), expected);