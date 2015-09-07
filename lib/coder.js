"use strict";

var SourceMapGenerator = require('source-map').SourceMapGenerator;
var sourceMapTransfer  = require('multi-stage-sourcemap').transfer;
var fs                 = require('fs');
var path               = require('path');
var stylecow           = require('./index');

stylecow.Coder = class {
    constructor (style) {
        this.style(style || 'normal');
        this.styles = getDefaultStyles();
    }

    use (module) {
        module(this);

        return this;
    }

    addStyle (name, style) {
        Object.keys(this.styles.normal).forEach(function(i) {
            if (!(style.hasOwnProperty(i))) {
                throw new Error(`Missing "${i}" property in the custom code style`);
            }
        });

        this.styles[name] = style;

        return this;
    }

    style (name) {
        this.styleName = name;

        return this;
    }

    sourceMap (cssFile, mapFile) {
        this.cssFile = cssFile || '';
        this.mapFile = mapFile || true;

        return this;
    }

    run (css) {
        this.codeStyle = this.styles[this.styleName];
        this.sourceMapRoot = null;
        this.indentStr = '';
        this.indent = [];
        this.column = 1;
        this.line = 1;
        this.code = '';
        this.map = false;

        if (this.mapFile) {
            if (this.mapFile === true) {
                this.sourceMapRoot = path.dirname(this.cssFile);
            } else {
                this.sourceMapRoot = path.dirname(this.mapFile);
            }

            this.map = new SourceMapGenerator({
                file: path.relative(this.sourceMapRoot, this.mapFile),
                root: this.sourceMapRoot
            });

            //find the previous sourceMap for multi-level source maps
            let previousSourceMap;
            let comment = css.getChild({
                type: 'Comment',
                name: /^[#@]\ssourceMappingURL=/
            });

            if (comment) {
                let inlineSourceMap = comment.name.split('sourceMappingURL=')[1].trim();
                comment.remove();

                if (inlineSourceMap.indexOf('data:application/json;base64,') === 0) {
                    previousSourceMap = JSON.parse((new Buffer(inlineSourceMap.substr(29), 'base64')).toString());
                } else {
                    let rel = path.resolve(this.sourceMapRoot, path.dirname(css.getData('file')) || '');
                    previousSourceMap = JSON.parse(fs.readFileSync(path.resolve(rel, inlineSourceMap)));
                }
            }

            css.toCode(this);

            if (previousSourceMap) {
                this.map = JSON.parse(sourceMapTransfer({
                    fromSourceMap: this.map.toString(),
                    toSourceMap: previousSourceMap
                }));
            } else {
                this.map = this.map.toJSON();
            }

            if (sourceMap === true) {
                this.code += '\n/*# sourceMappingURL=data:application/json;base64,' + (new Buffer(JSON.stringify(this.map))).toString('base64') + ' */\n';
            } else if (sourceMap === 'string') {
                this.code += '\n/*# sourceMappingURL=' + path.relative(path.dirname(this.cssFile), sourceMap) + ' */\n';
            }
        } else {
            css.toCode(this);
        }

        var result = {
            css: this.code,
            map: this.map
        };

        delete this.codeStyle;
        delete this.sourceMapRoot;
        delete this.indentStr;
        delete this.indent;
        delete this.column;
        delete this.line;
        delete this.code;
        delete this.map;

        return result;
    }

    get (name) {
        return this.codeStyle[name];
    }

    appendStyle (name) {
        this.append(this.codeStyle[name]);

        return this;
    }

    append (code, original) {
        if (this.map && original) {
            let file = original.getData('file');

            if (file) {
                this.map.addMapping({
                    generated: {
                        line: this.line,
                        column: this.column
                    },
                    source: path.relative(this.sourceMapRoot, file),
                    original: {
                        line: original.getData('line'),
                        column: original.getData('col')
                    },
                    name: code
                });
            }
        }

        for (let i = 0, l = code.length; i < l; i++) {
            this.code += code[i];

            if (code[i] === '\n') {
                ++this.line;
                this.code += this.indentStr;
                this.column = this.indentStr.length;
            } else {
                ++this.column;
            }
        }
    }

    pushIndentation () {
        this.indent.push(this.codeStyle['indentation']);
        this.indentStr = this.indent.join('');
    }

    popIndentation () {
        var indent = this.indent.pop();

        if (this.code.substr(-indent.length) === indent) {
            this.code = this.code.slice(0, -indent.length);
        }

        this.indentStr = this.indent.join('');
    }
}

function getDefaultStyles () {
    return {
        "normal": {
            "indentation": "\t",
            "block-opening-bracket-before": ' ',
            "block-opening-bracket-after": '\n',
            "block-closing-bracket-before": '',
            "block-closing-bracket-after": '',
            "declaration-before": "",
            "declaration-after": "\n",
            "declaration-colon-before": "",
            "declaration-colon-after": " ",
            "declaration-comma-before": "",
            "declaration-comma-after": " ",
            "selector-comma-before": "",
            "selector-comma-after": "\n",
            "rule-before": "",
            "rule-after": "\n",
            "string-quotes": "'",
            "number-leading-zero": true,
            "comparator-before": " ",
            "comparator-after": " ",
            "selector-combinator-before": " ",
            "selector-combinator-after": " ",
            "function-opening-parenthesis-after": "",
            "function-closing-parenthesis-before": "",
            "function-comma-before": "",
            "function-comma-after": " ",
            "comment-before": "\n",
            "comment-after": "\n",
            "comments": "all", // (all|important|none)
            "at-rule-block-before": "",
            "at-rule-block-after": "\n",
            "at-rule-inline-before": "",
            "at-rule-inline-after": "\n"
        },
        "minify": {
            "indentation": "",
            "block-opening-bracket-before": '',
            "block-opening-bracket-after": '',
            "block-closing-bracket-before": '',
            "block-closing-bracket-after": '',
            "declaration-before": "",
            "declaration-after": "",
            "declaration-colon-before": "",
            "declaration-colon-after": "",
            "declaration-comma-before": "",
            "declaration-comma-after": "",
            "selector-comma-before": "",
            "selector-comma-after": "",
            "rule-before": "",
            "rule-after": "",
            "string-quotes": "'",
            "number-leading-zero": false,
            "comparator-before": "",
            "comparator-after": "",
            "selector-combinator-before": "",
            "selector-combinator-after": "",
            "function-opening-parenthesis-after": "",
            "function-closing-parenthesis-before": "",
            "function-comma-before": "",
            "function-comma-after": "",
            "comment-before": "",
            "comment-after": "",
            "comments": "none", // (all|important|none)
            "at-rule-block-before": "",
            "at-rule-block-after": "",
            "at-rule-inline-before": "",
            "at-rule-inline-after": ""
        }
    };
}