(function (stylecow) {

	stylecow.MediaQueries = function () {
		this.class = 'MediaQueries';
		this.type = 'MediaQueries';
	};

	stylecow.MediaQueries.create = function (reader) {
		var t = stylecow.Tokens;
		var element;

		do {
			reader.skipWhitespace();

			if (reader.currToken[0] === t.COMMA && element) {
				reader.next(true);
			}

			var child = stylecow.MediaQuery.create(reader);

			if (!child) {
				if (!element) {
					return;
				}

				return reader.error();
			}

			if (!element) {
				element = new stylecow.MediaQueries();
			}

			element.push(child);

			reader.skipWhitespace();

		} while (reader.currToken[0] === t.COMMA);

		return element;
	};

	stylecow.MediaQueries.prototype = Object.create(stylecow.Base, {
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
