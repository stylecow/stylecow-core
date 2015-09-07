var assert   = require('assert');
var stylecow = require('../lib');

var cases = new stylecow.Test(__dirname + '/cases');

cases.run(function (test) {
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
