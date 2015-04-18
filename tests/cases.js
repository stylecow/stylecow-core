var assert = require('assert');
var stylecow = require('../lib');

stylecow.testCases(__dirname + '/cases', function (test) {
	describe('cases/' + test.name, function() {

		it('should match output.css', function() {
			//test.write('output.css', test.css.toString());
			assert.equal(test.css.toString(), test.read('output.css'));
		});

		it('should match ast.json', function() {
			//test.writeJson('ast.json', test.css.toAst());
			assert.deepEqual(test.css.toAst(), test.readJson('ast.json'));
		});
	});
});

stylecow.testCases(__dirname + '/tests', function (test) {
	describe('tests/' + test.name, function() {

		it('should match output.css', function() {
			//test.write('output.css', test.css.toString());
			assert.equal(test.css.toString(), test.read('output.css'));
		});

		it('should match ast.json', function() {
			//test.writeJson('ast.json', test.css.toAst());
			assert.deepEqual(test.css.toAst(), test.readJson('ast.json'));
		});

		it('should match output.min.css', function() {
			var coder = new stylecow.Coder(test.css, {
				style: 'minify'
			});

			//test.write('output.min.css', coder.code);
			assert.equal(coder.code, test.read('output.min.css'));
		});
	});
});
