var assert   = require('assert');
var stylecow = require('../lib');

var cases = new stylecow.Test(__dirname + '/cases');
var coder = new stylecow.Coder();

cases.cssErrors(true).run(function (test) {
    describe('cases/' + test.name, function() {
        it('should match output.css', function() {
            //test.writeString()
            test.assertString();
        });

        var code = coder.run(test.css);

        it('should match output.normal.css', function() {
            //test.write('output.normal.css', code.css);
            assert.equal(test.normalize(code.css), test.read('output.normal.css'));
        });

        it('clone should match output.css', function() {
            //test.write('output.css', test.css.toString());
            assert.equal(test.css.clone().toString(), test.read('output.css'));
        });

        it('should match ast.json', function() {
            //test.writeAst()
            test.assertAst();
        });
    });
});
