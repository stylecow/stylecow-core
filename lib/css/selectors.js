(function (stylecow) {

	stylecow.Selectors = function () {
		this.class = 'Selectors';
		this.type = 'Selectors';
	};

	stylecow.Selectors.create = function (reader) {
		var t = stylecow.Tokens;
		var element;

		do {
			reader.skipWhitespace();

			if (reader.currToken[0] === t.COMMA && element) {
				reader.next(true);
			}

			var child = stylecow.Selector.create(reader);

			if (!child) {
				if (!element) {
					return;
				}

				return stylecow.Error.fromToken(reader);
			}

			if (!element) {
				element = new stylecow.Selectors();
			}

			element.push(child);

			reader.skipWhitespace();

		} while (reader.currToken[0] === t.COMMA);

		return element;
	};

	stylecow.Selectors.prototype = Object.create(stylecow.Base, {
		toString: {
			value: function () {
				return this.join(', ');
			}
		},

		toCode: {
			value: function (code) {
				var latest = this.length - 1;

				this.forEach(function (child, k) {
					child.toCode(code);

					if (k !== latest) {
						code.append(code.style.valueJoiner);
					}
				});
			}
		}
	});
})(require('../index'));
