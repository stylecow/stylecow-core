(function (stylecow) {

	stylecow.PseudoClassFunction = function (name) {
		this.class = 'PseudoClassFunction';
		this.type = 'PseudoClass';
		this.name = name;
	};

	stylecow.PseudoClassFunction.create = function (reader) {
		var t = stylecow.Tokens;

		reader.skipWhitespace();
		
		if (reader.currToken[0] === t.COLON && reader.nextToken[0] === t.NAME && reader.tokens.tokens[reader.pos + 1][0] === t.OPEN_PARENTHESIS) {
			var element = new stylecow.PseudoClassFunction(reader.nextToken[3]);
			reader.next();
			reader.next();

			do {
				reader.next();

				var value = stylecow.Value.create(reader);
				
				if (!value) {
					return stylecow.Error.fromToken(reader);
				}

				element.push(value);

				reader.skipWhitespace();

			} while (reader.currToken[0] === t.COMMA);

			if (reader.currToken[0] !== t.CLOSE_PARENTHESIS) {
				return stylecow.Error.fromToken(reader);
			}

			reader.next();

			return element;
		}
	};

	stylecow.PseudoClassFunction.prototype = Object.create(stylecow.Keyword, {
		toString: {
			value: function () {
				if (this.vendor) {
					return ':-' + this.vendor + '-' + this.name;
				}

				return ':' + this.name;
			}
		}
	});
})(require('../index'));
