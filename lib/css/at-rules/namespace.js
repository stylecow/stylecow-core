(function (stylecow) {

	stylecow.Namespace = function () {
		this.class = 'Namespace';
		this.type = 'AtRule';
		this.name = 'namespace';
	};

	stylecow.Namespace.create = function (reader) {
		var t = stylecow.Tokens;

		reader.skipWhitespace();

		if (reader.currToken[0] === t.AT && reader.nextToken[0] === t.NAME && reader.nextToken[3] === 'namespace') {
			var element = new stylecow.Namespace();
			reader.next();
			reader.next(true);

			if (reader.currToken[0] === t.NAME) {
				element.push(stylecow.Keyword.create(reader) || reader.error());
			}

			element.push(stylecow.Url.create(reader) || reader.error());

			reader.skipWhitespace();

			if (reader.currToken[0] === t.SEMICOLON) {
				reader.next();
			}

			return element;
		}
	};

	stylecow.Namespace.prototype = Object.create(stylecow.Base, {
		toString: {
			value: function () {
				return '@' + this.name + ' ' + this.join(' ') + ';';
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
})(require('../../index'));
