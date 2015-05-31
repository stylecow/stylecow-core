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
	require('./css/expression');
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
	require('./css/selectors/placeholder-selector');

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
	require('./css/at-rules/custom-selector');
	require('./css/at-rules/supports');
	require('./css/at-rules/at-rule');
	require('./css/at-rules/charset');
	require('./css/at-rules/extend');
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
	stylecow.parse = function (code, className, constructor, filename) {
		className = className || 'Root';
		constructor = constructor || 'create';
		filename = filename || '';

		var css = stylecow[className][constructor](new stylecow.Reader(new stylecow.Tokens(code), filename));

		return css;
	};

	//Parse a css file
	stylecow.parseFile = function (file) {
		var fs = require('fs');
		var path = require('path');

		file = path.resolve(stylecow.cwd(), file);

		var css = stylecow.Root.create(new stylecow.Reader(new stylecow.Tokens(fs.readFileSync(file, 'utf8')), file));
		css.data.file = file;

		return css;
	};

	//Execute tests cases
	stylecow.testCases = function (dir, test, filter) {
		var fs = require('fs');
		var path = require('path');
		var cases = fs.readdirSync(dir);

		cases.forEach(function(name) {
			if (name[0] === '.') {
				return;
			}

			if (filter && filter.indexOf(name) === -1) {
				return;
			}

			var testData = {
				name: name,
				css: stylecow.parseFile(path.join(dir, name, 'input.css')),

				path: function (file) {
					return path.join(dir, name, file);
				},

				readJson: function (file) {
					file = testData.path(file);

					if (fs.existsSync(file)) {
						return require(file);
					}
				},

				writeJson: function (file, content) {
					file = testData.path(file);
					fs.writeFileSync(file, JSON.stringify(content, undefined, '  '));
				},

				read: function (file) {
					file = testData.path(file);

					if (!fs.existsSync(file)) {
						return '';
					}

					return testData.normalize(fs.readFileSync(file, 'utf8'));
				},

				normalize: function (src) {
					// normalize line endings
					src = src.replace(/\r\n/, '\n');

					// remove trailing newline
					src = src.replace(/\n$/, '');

					return src;
				},

				write: function (file, content) {
					fs.writeFileSync(testData.path(file), content);
				}
			};

			test(testData);
		});
	}
})(require('./index'));
