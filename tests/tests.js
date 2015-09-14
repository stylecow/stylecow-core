var assert   = require('assert');
var stylecow = require('../lib');

var test     = new stylecow.Test(__dirname + '/tests');
var code     = new stylecow.Coder();
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

        it('should match output.normal.css', function() {
            //test.write('output.normal.css', coder.code);
            assert.equal(test.normalize(code.run(test.css).css), test.read('output.normal.css'));
        });

        var minify = minifier.run(test.css, 'output.min.css', 'output.min.map');

        it('should match output.min.css', function() {
            //test.write('output.min.css', minify.css);
            assert.equal(test.normalize(minify.css), test.read('output.min.css'));
        });

        it('should match output.min.map', function() {
            //test.write('output.min.map', minify.map);
            assert.equal(test.normalize(minify.map), test.read('output.min.map'));
        });
    });
});
