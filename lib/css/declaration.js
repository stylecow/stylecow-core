(function (stylecow) {

	stylecow.Declaration = function (name) {
		this.class = 'Declaration';
		this.type = 'Declaration';
		this.setFullName(name);
	};

	stylecow.Declaration.create = function (reader) {
		var t = stylecow.Tokens;

		reader.skipWhitespace();

		if (reader.currToken[0] === t.NAME) {
			var element = new stylecow.Declaration(reader.currToken[3]);
			reader.next(true);

			if (reader.currToken[0] !== t.COLON) {
				return reader.error();
			}

			do {
				reader.next();
				element.push(stylecow.Value.create(reader) || reader.error());
				reader.skipWhitespace();

			} while (reader.currToken[0] === t.COMMA);

			if (reader.currToken[0] === t.SEMICOLON) {
				reader.next();
			}

			return element;
		}
	};

	stylecow.Declaration.prototype = Object.create(stylecow.Keyword.prototype, {
		toString: {
			value: function () {
				return (this.vendor ? '-' + this.vendor + '-' : '') + this.name + ': ' + this.join(', ') + ';';
			}
		},

		toCode: {
			value: function (code) {
				code.append(this.name + code.style.ruleColon, this);

				var latest = this.length - 1;

				this.forEach(function (child, k) {
					child.toCode(code);

					if (k !== latest) {
						code.append(code.style.valueJoiner);
					}
				});

				code.append(code.style.ruleEnd);
			}
		}
	});
})(require('../index'));
