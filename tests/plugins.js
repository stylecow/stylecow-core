var assert    = require('assert');
var stylecow  = require('../lib');

var test      = (new stylecow.Test(__dirname + '/tests')).filter(['plus.google.com']);
var tasks     = (new stylecow.Tasks())
                .use(require('./plugins/url-to-uri'))
                .use(require('./plugins/id-to-class'));

test.run(function (test) {
    tasks.run(test.css);

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
});
