(function (stylecow) {

	stylecow.Declaration = function (name) {
		this.class = 'Declaration';
		this.type = 'Declaration';
		this.setFullName(name);
	};

	stylecow.Declaration.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.WHITESPACE) {
			reader.next();
		}

		if (reader.currToken[0] === t.NAME) {
			var element = new stylecow.Declaration(reader.currToken[3]);
			reader.next();

			if (reader.currToken[0] === t.WHITESPACE) {
				reader.next();
			}

			if (reader.currToken[0] !== t.COLON) {
				return stylecow.Error.fromToken(reader);
			}

			do {
				reader.next();

				var value = stylecow.Value.create(reader);
				
				if (!value) {
					return stylecow.Error.fromToken(reader);
				}

				element.push(value);

				if (reader.currToken[0] === t.WHITESPACE) {
					reader.next();
				}

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
