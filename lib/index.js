(function (stylecow) {

    // CSS elements
    require('./css/root');

    // Basic
    require('./css/keyword');
    require('./css/unit');
    require('./css/number');
    require('./css/hex');
    require('./css/operator');
    require('./css/expression');
    require('./css/comparator');
    require('./css/bang');
    require('./css/string');
    require('./css/comment');
    require('./css/function');
    require('./css/value');
    require('./css/declaration');
    require('./css/block');
    require('./css/rule');
    require('./css/extension-name');
    require('./css/keyframe');
    require('./css/at-rule');
    require('./css/nested-at-rule');

    // Selectors
    require('./css/selectors');
    require('./css/selector');
    require('./css/type-selector');
    require('./css/class-selector');
    require('./css/id-selector');
    require('./css/combinator');
    require('./css/universal-selector');
    require('./css/attribute-selector');
    require('./css/pseudo-class');
    require('./css/pseudo-class-function');
    require('./css/pseudo-element');
    require('./css/placeholder-selector');
    require('./css/keyframe-selector');

    // Conditional selectors
    require('./css/media-queries');
    require('./css/media-query');
    require('./css/conditional-selector');
    require('./css/conditional-expression');
    require('./css/conditional-feature');
    require('./css/conditional-feature-boolean');
    require('./css/conditional-feature-range');

    // Other classes
    require('./tokens');
    require('./reader');
    require('./coder');
    require('./tasks');
    require('./test');

    stylecow.parse = function (code, className, parent, file) {
        className = className || 'Root';

        return stylecow[className].create(new stylecow.Reader(new stylecow.Tokens(code), file || ''), parent);
    }

    stylecow.parseFile = function (file) {
        var fs = require('fs');

        return stylecow.parse(fs.readFileSync(file, 'utf8'), 'Root', null, file);
    }

})(require('./index'));
