(function (stylecow) {

	stylecow.Declaration = function (name) {
		this.class = 'Declaration';
		this.type = 'Declaration';
		this.setFullName(name);
	};

	stylecow.Declaration.create = function (reader) {
		var t = stylecow.Tokens;
		var element; 

		if (reader.currToken[0] === t.NAME) {
			element = new stylecow.Declaration(reader.getAndMove()[3]);
		} else if (reader.currToken[0] === t.ASTERISK && reader.nextToken[0] === t.NAME) { //ie
			reader.move();
			element = new stylecow.Declaration('*' + reader.getAndMove()[3]);
		} else {
			return;
		}

		reader.skipAll(t.COMMENT);
		reader.skip(t.COLON) || reader.error();

		do {
			element.push(stylecow.Value.create(reader) || reader.error());

		} while (reader.currToken[0] === t.COMMA && reader.move());

		reader.skip(t.SEMICOLON);

		return element;
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
