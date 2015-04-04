(function (stylecow) {

	stylecow.Root = function () {
		this.type = 'Root';
		this.class = 'Root';
	};

	stylecow.Root.create = function (reader) {
		var t = stylecow.Tokens;
		var element = new stylecow.Root();

		reader.skipWhitespace();

		while (reader.currToken[0] !== t.EOF) {
			element.push(
					stylecow.Comment.create(reader)
				 || stylecow.Charset.create(reader)
				 || stylecow.Import.create(reader)
				 || stylecow.Media.create(reader)
				 || stylecow.Namespace.create(reader)
				 || stylecow.Supports.create(reader)
				 || stylecow.Keyframes.create(reader)
				 || stylecow.AtRule.create(reader)
				 || stylecow.Rule.create(reader)
				 || reader.error()
			);

			reader.skipWhitespace();
		}

		return element;
	};

	stylecow.Root.prototype = Object.create(stylecow.Base, {
		toString: {
			value: function () {
				return this.map(function (child) {
					return child.toString();
				}).filter(function (string) {
					return string ? true : false;
				}).join("\n");
			}
		},

		toCode: {
			value: function (code) {
				this.forEach(function (child) {
					child.toCode(code);
					code.append(code.style.linebreak);
				});
			}
		}
	});
})(require('../index'));
