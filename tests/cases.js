var fs = require('fs');
var path = require('path');
var stylecow = require('../lib');
var assert = require('assert');

var cases = fs.readdirSync(path.join(__dirname, 'cases'));

cases.forEach(function(name) {
	if (name[0] === '.') {
		return;
	}

	describe('cases/' + name, function() {
		var dir = path.join(__dirname, 'cases', name);
		var inputFile = path.join(dir, 'input.css');
		var astFile = path.join(dir, 'ast.json');
		var outputFile = path.join(dir, 'output.css');

		var css = stylecow.Root.create(stylecow.Reader.fromFile(inputFile));

		//fs.writeFileSync(astFile, JSON.stringify(css.toAst(), null, '\t'));
		//fs.writeFileSync(outputFile, css.toString());

		it('should match ast.json', function() {
			assert.deepEqual(require(astFile), css.toAst());
		});

		it('should match output.css', function() {
			assert.equal(readFile(outputFile), css.toString());
		});
	});
});

function readFile(file) {
	var src = fs.readFileSync(file, 'utf8');
	// normalize line endings
	src = src.replace(/\r\n/, '\n');
	// remove trailing newline
	src = src.replace(/\n$/, '');

	return src;
}
