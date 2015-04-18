(function (stylecow) {

	// CSS Prototypes
	require('./prototypes');

	// CSS elements
	require('./css/root');

	// Basic
	require('./css/keyword');
	require('./css/unit');
	require('./css/number');
	require('./css/hex');
	require('./css/operator');
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
	require('./css/selectors/selectors');
	require('./css/selectors/selector');
	require('./css/selectors/type-selector');
	require('./css/selectors/class-selector');
	require('./css/selectors/id-selector');
	require('./css/selectors/universal-selector');
	require('./css/selectors/combinator');
	require('./css/selectors/match-combinator');
	require('./css/selectors/attribute-selector');
	require('./css/selectors/pseudo-class');
	require('./css/selectors/pseudo-class-function');
	require('./css/selectors/pseudo-element');

	// Conditional selectors
	require('./css/conditional-selectors/media-queries');
	require('./css/conditional-selectors/media-query');
	require('./css/conditional-selectors/conditional-selector');
	require('./css/conditional-selectors/conditional-feature');
	require('./css/conditional-selectors/conditional-expression');

	// @-rules
	require('./css/at-rules/keyframes');
	require('./css/at-rules/media');
	require('./css/at-rules/document');
	require('./css/at-rules/custom-media');
	require('./css/at-rules/supports');
	require('./css/at-rules/at-rule');
	require('./css/at-rules/charset');
	require('./css/at-rules/import');
	require('./css/at-rules/namespace');

	require('./tokens');
	require('./reader');
	require('./coder');

	//Change the current directory
	var cwd = process.cwd();

	stylecow.cwd = function (newCwd) {
		if (newCwd === undefined) {
			return cwd;
		}

		cwd = newCwd;

		return stylecow;
	};

	//Parse a css string
	stylecow.parse = function (code, className, constructor) {
		className = className || 'Root';
		constructor = constructor || 'create';

		var css = stylecow[className][constructor](new stylecow.Reader(new stylecow.Tokens(code)));
		css.data.file = '';

		return css;
	};

	//Parse a css file
	stylecow.parseFile = function (file) {
		var fs = require('fs');

		var css = stylecow.parse(fs.readFileSync(file, 'utf8'));
		css.data.file = file;

		return css;
	};

	//Execute tests cases
	stylecow.testCases = function (dir, test) {
		var fs = require('fs');
		var path = require('path');
		var assert = require('assert');
		var cases = fs.readdirSync(dir);

		cases.forEach(function(name) {
			if (name[0] === '.') {
				return;
			}

			var inputFile = path.join(dir, name, 'input.css');
			var astFile = path.join(dir, name, 'ast.json');
			var outputFile = path.join(dir, name, 'output.css');

			var css = stylecow.parseFile(inputFile);
			var output = readFile(outputFile);

			if (!fs.existsSync(astFile)) {
				var ast = {};
			} else {
				var ast = require(astFile);
			}

			var asserts = function () {
				assert.equal(output, css.toString());
				assert.deepEqual(ast, css.toAst());
			};

			asserts.regenerate = function () {
				console.log('  GENERATED FILES: output.css, ast.json');
				console.log('');
				fs.writeFileSync(astFile, JSON.stringify(css.toAst(), undefined, '  '));
				fs.writeFileSync(outputFile, css.toString());
			};

			test(name, css, asserts);
		});

		function readFile(file) {
			if (!fs.existsSync(file)) {
				return '';
			}

			var src = fs.readFileSync(file, 'utf8');
			// normalize line endings
			src = src.replace(/\r\n/, '\n');
			// remove trailing newline
			src = src.replace(/\n$/, '');

			return src;
		}
	}
})(require('./index'));
