(function (stylecow) {

	stylecow.Function = function (name) {
		this.class = 'Function';
		this.type = 'Function';
		this.setFullName(name);
	};

	stylecow.Function.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.NAME && reader.nextToken[0] === t.OPEN_PARENTHESIS) {
			var element = new stylecow.Function(reader.currToken[3]);
			reader.move();
			reader.move();

			do {
				element.push(stylecow.Value.create(reader) || reader.error());

			} while (reader.currToken[0] === t.COMMA && reader.move());

			reader.skip(t.CLOSE_PARENTHESIS) || reader.error();

			return element;
		}
	};

	stylecow.Function.prototype = Object.create(stylecow.Keyword.prototype, {
		toString: {
			value: function () {
				return (this.vendor ? '-' + this.vendor + '-' : '') + this.name + '(' + this.join(', ') + ')';
			}
		},

		toCode: {
			value: function (code) {
				code.append(this.name + '(', this);

				var latest = this.length - 1;

				this.forEach(function (child, k) {
					child.toCode(code);

					if (k !== latest) {
						code.append(code.style.argumentJoiner);
					}
				});

				code.append(')');
			}
		}
	});
})(require('../index'));
