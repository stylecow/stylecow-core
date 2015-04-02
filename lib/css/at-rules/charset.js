(function (stylecow) {

	stylecow.Charset = function () {
		this.class = 'Charset';
		this.type = 'AtRule';
		this.name = 'charset';
	};

	stylecow.Charset.create = function (reader) {
		var t = stylecow.Tokens;

		reader.skipWhitespace();

		if (reader.currToken[0] === t.AT && reader.nextToken[0] === t.NAME && reader.nextToken[3] === 'charset') {
			var element = new stylecow.Charset();
			reader.next();
			reader.next(true);

			element.push(stylecow.String.create(reader) || reader.error());

			return element;
		}
	};

	stylecow.Charset.prototype = Object.create(stylecow.Base, {
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
