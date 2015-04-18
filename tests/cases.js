var stylecow = require('../lib');

stylecow.testCases(__dirname + '/cases', function (name, css, assert) {
	describe('cases/' + name, function() {
		it('should match output.css and ast.json', function() {
			assert();
		});
	});
});
