var assert   = require('assert');
var stylecow = require('../lib');

var test     = new stylecow.Test(__dirname + '/tests');
var normal   = new stylecow.Coder();
var minifier = new stylecow.Coder('minify');

test.run(function (test) {
    describe('tests/' + test.name, function() {
        this.timeout(6000);

        it('should match output.css', function() {
            //test.writeString()
            test.assertString();
        });

        it('should match ast.json', function() {
            //test.writeAst()
            test.assertAst();
        });

        var normalCode = normal.run(test.css);
        var minifyCode = minifier.run(test.css, 'output.min.css');

        it('should match output.normal.css', function() {
            //test.write('output.normal.css', normalCode.css);
            assert.equal(test.normalize(normalCode.css), test.read('output.normal.css'));
        });

        it('should match output.min.css', function() {
            //test.write('output.min.css', minifyCode.css);
            assert.equal(test.normalize(minifyCode.css), test.read('output.min.css'));
        });

        it('should match output.min.map', function() {
            //test.write('output.min.map', minifyCode.map);
            assert.equal(test.normalize(minifyCode.map), test.read('output.min.map'));
        });
    });
});
