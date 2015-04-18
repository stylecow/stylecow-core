(function (stylecow) {

	stylecow.Value = function () {
		this.class = 'Value';
		this.type = 'Value';
		this.data = {};
	};

	stylecow.Value.create = function (reader) {
		var t = stylecow.Tokens;
		var element = (new stylecow.Value()).setSource(reader);

		do {
			if (reader.currToken[0] === t.CLOSE_PARENTHESIS || reader.currToken[0] === t.EXCLAMATION || reader.currToken[0] === t.SEMICOLON || reader.currToken[0] === t.CLOSE_CURLY_BRACKET || reader.currToken[0] === t.OPEN_CURLY_BRACKET || reader.currToken[0] === t.COMMA || reader.currToken[0] === t.EOF) {
				break;
			}

			if (reader.currToken[0] === t.SOLIDUS || reader.currToken[0] === t.PLUS) {
				element.push(stylecow.Operator.create(reader));
			}

			element.push(
				stylecow.Function.createUrl(reader)
				|| stylecow.Function.create(reader)
				|| stylecow.Comment.create(reader)
				|| stylecow.Keyword.create(reader)
				|| stylecow.Hex.create(reader)
				|| stylecow.String.create(reader)
				|| stylecow.Unit.create(reader)
				|| stylecow.Number.create(reader)
				|| stylecow.Operator.create(reader)
				|| reader.error()
			);

		} while ((reader.get(-2)[0] === t.WHITESPACE) || reader.currToken[0] === t.SOLIDUS);

		return element;
	};

	stylecow.Value.prototype = Object.create(stylecow.prototypes.NodeCollection, {
		toString: {
			value: function () {
				return this.join(' ');
			}
		},
		toCode: {
			value: function (code) {
				var latest = this.length - 1;

				this.forEach(function (child, k) {
					child.toCode(code);

					if (k !== latest) {
						code.append(' ');
					}
				});
			}
		}
	});
})(require('../index'));
