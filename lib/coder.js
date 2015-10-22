"use strict";

let SourceMapGenerator = require('source-map').SourceMapGenerator;
let sourceMapTransfer  = require('multi-stage-sourcemap').transfer;
let fs                 = require('fs');
let path               = require('path');
let stylecow           = require('./index');

stylecow.Coder = class {
    constructor (style) {
        this.style(style || 'normal');
        this.styles = getDefaultStyles();
        this.sourceMapMode = 'auto';
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

    // available modes: "auto", "embed", "none"
    sourceMap (mode) {
        if (['auto', 'embed', 'none'].indexOf(mode) === -1) {
            throw new Error('Mode no valid');
        }

        this.sourceMapMode = mode;

        return this;
    }

    run (css, cssFile, mapDest, previousMap) {
        this.codeStyle = this.styles[this.styleName];
        this.sourceMapRoot = null;
        this.indentStr = '';
        this.indent = [];
        this.column = 1;
        this.line = 1;
        this.code = '';
        this.map = false;

        let prev = extractSourceMap(css);

        //map destination
        if (mapDest === undefined) {
            if (this.sourceMapMode === 'embed') {
                mapDest = true;
            } else if (this.sourceMapMode === 'none') {
                mapDest = false;
            } else if (prev.dest) {
                mapDest = prev.dest;
            } else if (cssFile) {
                mapDest = cssFile.replace(/\.css$/, '.map');
            } else {
                mapDest = false;
            }
        }

        //Init map
        if (mapDest === true) { //embed
            this.sourceMapRoot = cssFile ? path.dirname(cssFile) : '';

            this.map = new SourceMapGenerator({
                file: '',
                root: this.sourceMapRoot
            });
        } else if (mapDest) { //external file
            this.sourceMapRoot = path.dirname(mapDest);
            
            this.map = new SourceMapGenerator({
                file: mapDest,
                root: this.sourceMapRoot
            });
        }

        css.toCode(this);

        if (mapDest) {
            //previous source
            if ((previousMap === undefined) && prev.map) {
                previousMap = prev.map;
            }

            if (previousMap) {
                this.map = sourceMapTransfer({
                    fromSourceMap: this.map.toString(),
                    toSourceMap: previousMap
                });
            } else {
                this.map = this.map.toString();
            }

            //sourcemap annotation
            if (mapDest === true) {
                this.code += '\n/*# sourceMappingURL=data:application/json;base64,' + (new Buffer(this.map)).toString('base64') + ' */\n';
            } else {
                this.code += '\n/*# sourceMappingURL=' + path.relative(path.dirname(cssFile), mapDest) + ' */\n';
            }
        }

        return {
            css: this.code,
            map: this.map
        };
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
        let indent = this.indent.pop();

        if (this.code.substr(-indent.length) === indent) {
            this.code = this.code.slice(0, -indent.length);
        }

        this.indentStr = this.indent.join('');
    }
}

function extractSourceMap (css) {
    let comment = css.getChild({
        type: 'Comment',
        name: /^[#@]\ssourceMappingURL=/
    });

    if (comment) {
        let inlineSourceMap = comment.name.split('sourceMappingURL=')[1].trim();
        comment.remove();

        if (inlineSourceMap.startsWith('data:application/json;base64,')) {
            return {
                map: JSON.parse((new Buffer(inlineSourceMap.substr(29), 'base64')).toString()),
                dest: true
            };
        }

        let sourceFile = path.resolve((path.dirname(css.getData('file')) || ''), inlineSourceMap);

        return {
            map: JSON.parse(fs.readFileSync(sourceFile)),
            dest: sourceFile
        }
    }

    return {
        map: null,
        dest: null
    };
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