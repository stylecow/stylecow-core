(function (stylecow) {
	var SourceMapGenerator = require('source-map').SourceMapGenerator;
	var sourceMapTransfer = require('multi-stage-sourcemap').transfer;
	var fs = require('fs');
	var path = require('path');

	stylecow.Coder = function (css, options) {
		options = options || {};

		this.file = options.file || '';
		this.sourceMap = options.sourceMap;
		this.indentStr = '';
		this.indent = [];
		this.column = 1;
		this.line = 1;
		this.code = '';
		this.map = false;
		this.style = stylecow.Coder.styles[options.style || 'normal'];

		if (!this.style) {
			throw new Error('Not valid code style: "' + options.style + '"');
		}

		if (this.sourceMap) {
			if (this.sourceMap === 'embed' || this.sourceMap === true) {
				this.sourceMapRoot = path.dirname(this.file);
			} else {
				this.sourceMapRoot = path.dirname(this.sourceMap);
			}

			this.map = new SourceMapGenerator({
				file: path.relative(this.sourceMapRoot, this.file),
				root: path.resolve(stylecow.cwd(), path.dirname(this.sourceMapRoot))
			});

			//find the previous sourceMap for multi-level source maps
			if (options.previousSourceMap === undefined) {
				var comment = css.getChild({
					type: 'Comment',
					name: /^[#@]\ssourceMappingURL=/
				});

				if (comment) {
					var inlineSourceMap = comment.name.split('sourceMappingURL=')[1].trim();
					comment.remove();

					if (inlineSourceMap.indexOf('data:application/json;base64,') === 0) {
						options.previousSourceMap = JSON.parse((new Buffer(inlineSourceMap.substr(29), 'base64')).toString());
					} else {
						var rel = path.resolve(stylecow.cwd(), path.dirname(css.getData('sourceFile')) || '');
						options.previousSourceMap = JSON.parse(fs.readFileSync(path.resolve(rel, inlineSourceMap)));
					}
				}
			}

			css.toCode(this);

			if (options.previousSourceMap) {
				this.map = JSON.parse(sourceMapTransfer({
					fromSourceMap: this.map.toString(),
					toSourceMap: options.previousSourceMap
				}));
			} else {
				this.map = this.map.toJSON();
			}

			if (this.sourceMap === 'embed') {
				this.code += '\n/*# sourceMappingURL=data:application/json;base64,' + (new Buffer(JSON.stringify(this.map))).toString('base64') + ' */\n';
			} else if (typeof this.sourceMap === 'string') {
				this.code += '\n/*# sourceMappingURL=' + path.relative(path.dirname(this.file), this.sourceMap) + ' */\n';
			}
		} else {
			css.toCode(this);
		}
	}

	stylecow.Coder.styles = {
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
			"selector-combinator-before": " ",
			"selector-combinator-after": " ",
			"function-opening-parenthesis-after": "",
			"function-closing-parenthesis-before": "",
			"function-comma-before": "",
			"function-comma-after": " ",
			"comment-before": "\n",
			"comment-after": "\n",
			"comments": "all", // (all|important|none)
			"at-rule-block-before": "\n",
			"at-rule-block-after": "",
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

	stylecow.Coder.prototype = {
		save: function () {
			save(this.file, this.code);

			if ((typeof this.sourceMap === 'string') && this.sourceMap !== 'embed') {
				save(this.sourceMap, JSON.stringify(this.map));
			}
		},
		appendStyle: function (name) {
			if (name in this.style) {
				this.append(this.style[name]);
			} else {
				this.append('<error>');
			}
		},
		append: function (code, original) {
			if (this.map && original) {
				var file = original.getData('file');

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

			for (var i = 0, l = code.length; i < l; i++) {
				this.code += code[i];

				if (code[i] === '\n') {
					++this.line;
					this.code += this.indentStr;
					this.column = this.indentStr.length;
				} else {
					++this.column;
				}
			}
		},
		pushIndentation: function () {
			this.indent.push(this.style['indentation']);
			this.indentStr = this.indent.join('');
		},
		popIndentation: function () {
			var indent = this.indent.pop();

			if (this.code.substr(-indent.length) === indent) {
				this.code = this.code.slice(0, -indent.length);
			}

			this.indentStr = this.indent.join('');
		}
	};

	function save (file, content) {
		file = path.resolve(stylecow.cwd(), file);

		var dir = path.dirname(file);

		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}

		fs.writeFileSync(file, content);
	}

})(require('./index'));
