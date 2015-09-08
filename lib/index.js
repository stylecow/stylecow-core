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

    // Conditional selectors
    require('./css/media-queries');
    require('./css/media-query');
    require('./css/conditional-selector');
    require('./css/conditional-expression');
    require('./css/conditional-feature');
    require('./css/conditional-feature-boolean');
    require('./css/conditional-feature-range');

    // @-rules
    require('./css/document');
    require('./css/at-rule');
    require('./css/nested-at-rule');

    // Other classes
    require('./tokens');
    require('./reader');
    require('./coder');
    require('./tasks');
    require('./test');

    stylecow.parse = function (code, className, constructor, file) {
        className = className || 'Root';
        constructor = constructor || 'create';

        return stylecow[className][constructor](new stylecow.Reader(new stylecow.Tokens(code), file || ''));
    }

    stylecow.parseFile = function (file) {
        var fs = require('fs');
        var css = stylecow.parse(fs.readFileSync(file, 'utf8'), 'Root', 'create', file);
        css.data.file = file;

        return css;
    }

})(require('./index'));
