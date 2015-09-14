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
            //test.writeString('output.plugins.css')
            test.assertString('output.plugins.css');
        });

        it('should match ast.plugins.json', function() {
            //test.writeString('ast.plugins.json')
            test.assertString('ast.plugins.json');
        });
    });
});
