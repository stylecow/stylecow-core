var assert   = require('assert');
var stylecow = require('../lib');

var test     = new stylecow.Test(__dirname + '/tests');
var code     = new stylecow.Coder();
var minifier = new stylecow.Coder('minify');

test.run(function (test) {
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
            //test.write('output.normal.css', coder.code);
            assert.equal(test.normalize(code.run(test.css).css), test.read('output.normal.css'));
        });

        var minify = minifier.sourceMap('output.min.css', 'output.min.map').run(test.css);

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
