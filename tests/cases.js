var stylecow = require('../lib');

stylecow.testCases(__dirname + '/cases', function (name, css, assert) {
	//assert.regenerate();

	describe('cases/' + name, function() {
		it('should match output.css and ast.json', function() {
			assert();
		});
	});
});

stylecow.testCases(__dirname + '/tests', function (name, css, assert) {
	//assert.regenerate();

	describe('tests/' + name, function() {
		it('should match output.css and ast.json', function() {
			assert();
		});
	});
});
