(function (stylecow) {

	stylecow.KeyframeSelectors = function () {
		this.class = 'KeyframeSelectors';
		this.type = 'KeyframeSelectors';
	};

	stylecow.KeyframeSelectors.create = function (reader) {
		var t = stylecow.Tokens;
		var element = new stylecow.KeyframeSelectors();

		reader.skipWhitespace();

		do {
			if (reader.currToken[0] === t.NAME && (reader.currToken[3] === 'from' || reader.currToken[3] === 'to')) {
				element.push(stylecow.Keyword.create(reader) || reader.error());
			} else {
				element.push(stylecow.Unit.create(reader) || reader.error());
			}

			reader.skipWhitespace();

		} while (reader.currToken[0] === t.COMMA && reader.next(true));

		return element;
	};

	stylecow.KeyframeSelectors.prototype = Object.create(stylecow.Selectors.prototype, {
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
})(require('../../index'));
