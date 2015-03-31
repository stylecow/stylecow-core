(function (stylecow) {

	stylecow.Url = function (name) {
		this.class = 'Url';
		this.type = 'Url';
		this.name = name;
	};

	stylecow.Url.create = function (reader) {
		var t = stylecow.Tokens;

		reader.skipWhitespace();

		var url;

		//url()
		if (reader.currToken[0] === t.NAME && reader.currToken[3] === 'url' && reader.nextToken[0] === t.OPEN_PARENTHESIS) {
			reader.next();
			reader.next(true);

			// url(address)
			if (reader.currToken[0] === t.STRING) {
				url = reader.currToken[3];
				reader.next(true);
			
			// url(address)
			} else {
				url = '';

				do {
					url += t.tokenToString(reader.currToken);

				} while (reader.next() && reader.currToken[0] !== t.CLOSE_PARENTHESIS && reader.currToken[0] !== t.WHITESPACE);
			}

			if (reader.currToken[0] !== t.CLOSE_PARENTHESIS) {
				return stylecow.Error.fromToken(reader);
			}

			reader.next();

		} else if (reader.currToken[0] === t.STRING) {
			url = reader.currToken[3];
			reader.next();
		}

		if (url) {
			var element = new stylecow.Url(url);

			return element;
		}
	};

	stylecow.Url.prototype = Object.create(stylecow.Base, {
		toString: {
			value: function () {
				return 'url("' + this.name + '")';
			}
		},

		toCode: {
			value: function (code) {
				code.append(this.toString(), this);
			}
		}
	});
})(require('../index'));
