(function (stylecow) {

	stylecow.Value = function () {
		this.class = 'Value';
		this.type = 'Value';
	};

	stylecow.Value.create = function (reader) {
		var t = stylecow.Tokens;

		reader.skipWhitespace();

		var element;

		do {
			var child = stylecow.Function.create(reader)
					|| stylecow.Keyword.create(reader)
					|| stylecow.String.create(reader)
					|| stylecow.Unit.create(reader)
					|| stylecow.Number.create(reader)
					|| stylecow.Comment.create(reader);

			if (!child) {
				return element;
			}

			if (!element) {
				element = new stylecow.Value();
			}

			element.push(child);
		} while (reader.currToken[0] === t.WHITESPACE);

		return element;
	};

	stylecow.Value.prototype = Object.create(stylecow.Base, {
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
