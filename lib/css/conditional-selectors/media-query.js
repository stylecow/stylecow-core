(function (stylecow) {

	stylecow.MediaQuery = function () {
		this.class = 'MediaQuery';
		this.type = 'MediaQuery';
	};

	stylecow.MediaQuery.create = function (reader) {
		var t = stylecow.Tokens;
		var element = new stylecow.MediaQuery();

		reader.skipWhitespace();

		// not|only operators
		if (reader.currToken[0] === t.NAME && (reader.currToken[3] === 'only' || reader.currToken[3] === 'not')) {
			element.push(stylecow.Keyword.create(reader) || reader.error());
			reader.skipWhitespace();
		}

		//media type
		if (reader.currToken[0] === t.NAME) {
			element.push(stylecow.Keyword.create(reader) || reader.error());

			reader.skipWhitespace();

			if (reader.currToken[0] === t.NAME) {
				if (reader.currToken[3] === 'and' || reader.currToken[3] === 'or') {
					element.push(stylecow.Keyword.create(reader) || reader.error());
					reader.skipWhitespace();
				} else {
					return reader.error();
				}
			} else {
				return element;
			}
		}

		while (reader.currToken[0] !== t.EOT) {
			element.push(stylecow.ConditionalExpression.create(reader) || reader.error());

			reader.skipWhitespace();

			// and|or
			if (reader.currToken[0] === t.NAME && (reader.currToken[3] === 'and' || reader.currToken[3] === 'or')) {
				element.push(stylecow.Keyword.create(reader) || reader.error());
				reader.skipWhitespace();
			} else {
				break;
			}
		}

		return element;
	};

	stylecow.MediaQuery.prototype = Object.create(stylecow.Keyword.prototype, {
		toString: {
			value: function () {
				return this.join(' ');
			}
		},

		toCode: {
			value: function (code) {
				code.append(this.toString(), this);
			}
		}
	});
})(require('../../index'));
