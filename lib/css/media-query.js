(function (stylecow) {

	stylecow.MediaQuery = function () {
		this.class = 'MediaQuery';
		this.type = 'MediaQuery';
	};

	stylecow.MediaQuery.create = function (reader) {
		var t = stylecow.Tokens;

		reader.skipWhitespace();

		if (reader.currToken[0] === t.NAME) {
			var element = new stylecow.MediaQuery();

			//mode
			if (reader.currToken[3] === 'only' || reader.currToken[3] === 'not') {
				element.push(stylecow.Keyword.create(reader));
			}

			reader.skipWhitespace();

			var and = false;

			//media type
			if (reader.currToken[0] === t.NAME) {
				var child = stylecow.MediaType.create(reader);

				if (!child) {
					return stylecow.Error.fromToken(reader);
				}

				element.push(child);

				reader.skipWhitespace();

				and = true;
			}

			if (!and || reader.currToken[0] !== t.NAME || reader.currToken[3] !== 'and') {
				return element;
			}

			reader.next(true);

			//media features
			do {
				var child = stylecow.MediaFeature.create(reader);

				if (!child) {
					return stylecow.Error.fromToken(reader);
				}

				element.push(child);

				reader.skipWhitespace();
			} while ((reader.currToken[0] === t.NAME || reader.currToken[3] === 'and') && reader.next());

			return element;
		}
	};

	stylecow.MediaQuery.prototype = Object.create(stylecow.Keyword.prototype, {
		toString: {
			value: function () {
				if (this[0].type === 'Keyword') {
					return this[0] + ' ' + this.slice(1).join(' and ');
				}

				return this.join(' and ');
			}
		},

		toCode: {
			value: function (code) {
				code.append(this.toString(), this);
			}
		}
	});
})(require('../index'));
