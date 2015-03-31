(function (stylecow) {

	stylecow.Function = function (name) {
		this.class = 'Function';
		this.type = 'Function';
		this.setFullName(name);
	};

	stylecow.Function.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.WHITESPACE) {
			reader.next();
		}

		if (reader.currToken[0] === t.NAME && reader.nextToken[0] === t.OPEN_PARENTHESIS) {
			var element = new stylecow.Function(reader.currToken[3]);
			reader.next();
			
			do {
				reader.next();

				var child = stylecow.Value.create(reader);
				
				if (!child) {
					return stylecow.Error.fromToken(reader);
				}

				element.push(child);

				if (reader.currToken[0] === t.WHITESPACE) {
					reader.next();
				}

			} while (reader.currToken[0] === t.COMMA);

			if (reader.currToken[0] !== t.CLOSE_PARENTHESIS) {
				return stylecow.Error.fromToken(reader);
			}

			reader.next();

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
