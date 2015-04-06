(function (stylecow) {

	stylecow.Import = function () {
		this.class = 'Import';
		this.type = 'AtRule';
		this.name = 'import';
	};

	stylecow.Import.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.AT && reader.nextToken[0] === t.NAME && reader.nextToken[3] === 'import') {
			var element = new stylecow.Import();
			reader.move();
			reader.move();

			element.push(stylecow.Url.create(reader) || reader.error());

			if (reader.currToken[0] === t.NAME) {
				element.push(stylecow.MediaQueries.create(reader) || reader.error());
			}

			reader.skip(t.SEMICOLON);

			return element;
		}
	};

	stylecow.Import.prototype = Object.create(stylecow.Base, {
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
