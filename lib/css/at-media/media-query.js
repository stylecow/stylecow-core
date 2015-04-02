(function (stylecow) {

	stylecow.MediaQuery = function () {
		this.class = 'MediaQuery';
		this.type = 'MediaQuery';
	};

	stylecow.MediaQuery.create = function (reader) {
		var t = stylecow.Tokens;
		var element;

		reader.skipWhitespace();

		// only|not keywords
		if (reader.currToken[0] === t.NAME && (reader.currToken[3] === 'only' || reader.currToken[3] === 'not')) {
			element = new stylecow.MediaQuery();
			element.push(stylecow.Keyword.create(reader));
			reader.skipWhitespace();
		}

		//media type
		if (reader.currToken[0] === t.NAME) {
			if (!element) {
				element = new stylecow.MediaQuery();
			}

			element.push(stylecow.MediaType.create(reader) || reader.error());

			reader.skipWhitespace();

			if (reader.currToken[0] === t.NAME) {
				if (reader.currToken[3] === 'and') {
					reader.next(true);
				} else {
					return reader.error();
				}
			} else {
				return element;
			}
		}

		//media features
		do {
			var child = stylecow.MediaFeature.create(reader);

			if (!child) {
				if (element) {
					return reader.error();
				} else {
					return;
				}
			} else {
				if (!element) {
					element = new stylecow.MediaQuery();
				}

				element.push(child);
			}

			reader.skipWhitespace();
		} while ((reader.currToken[0] === t.NAME || reader.currToken[3] === 'and') && reader.next());

		return element;
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
})(require('../../index'));
