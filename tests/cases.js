var assert = require('assert');
var stylecow = require('../lib');

stylecow.testCases(__dirname + '/cases', function (test) {
	describe('cases/' + test.name, function() {
		it('should match output.css', function() {
			//test.write('output.css', test.css.toString());
			assert.equal(test.css.toString(), test.read('output.css'));
		});

		it('clone should match output.css', function() {
			//test.write('output.css', test.css.toString());
			assert.equal(test.css.clone().toString(), test.read('output.css'));
		});

		it('should match ast.json', function() {
			//test.writeJson('ast.json', test.css.toAst());
			assert.deepEqual(test.css.toAst(), test.readJson('ast.json'));
		});
	});
});

stylecow.testCases(__dirname + '/tests', function (test) {
	describe('tests/' + test.name, function() {
		this.timeout(6000);

		it('should match output.css', function() {
			//test.write('output.css', test.css.toString());
			assert.equal(test.css.toString(), test.read('output.css'));
		});

		it('should match ast.json', function() {
			//test.writeJson('ast.json', test.css.toAst());
			assert.deepEqual(test.css.toAst(), test.readJson('ast.json'));
		});

		it('should match output.normal.css', function() {
			var coder = new stylecow.Coder(test.css, {style: 'normal'});

			//test.write('output.normal.css', coder.code);
			assert.equal(test.normalize(coder.code), test.read('output.normal.css'));
		});

		it('should match output.min.css', function() {
			var coder = new stylecow.Coder(test.css, {style: 'minify'});

			//test.write('output.min.css', coder.code);
			assert.equal(test.normalize(coder.code), test.read('output.min.css'));
		});
	});
});


stylecow
	.use(require('./plugins/url-to-uri'))
	.testCases(__dirname + '/tests', function (test) {
		stylecow.run(test.css);

		describe('cases/' + test.name, function() {
			this.timeout(6000);

			it('should match output.plugins.css', function() {
				//test.write('output.plugins.css', test.css.toString());
				assert.equal(test.css.toString(), test.read('output.plugins.css'));
			});

			it('should match ast.plugins.json', function() {
				//test.writeJson('ast.plugins.json', test.css.toAst());
				assert.deepEqual(test.css.toAst(), test.readJson('ast.plugins.json'));
			});
		});
	}, ['plus.google.com']);