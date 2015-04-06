(function (stylecow) {

	stylecow.PseudoClassPosition = function (name) {
		this.class = 'PseudoClassPosition';
		this.type = 'PseudoClass';
		this.setFullName(name);
	};

	stylecow.PseudoClassPosition.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.COLON && reader.nextToken[0] === t.NAME && reader.nextToken[3].match(/^(-(\w+)-)?(nth-.+)$/)) {
			var element = new stylecow.PseudoClassPosition(reader.nextToken[3]);
			reader.move();
			reader.move();

			reader.skip(t.OPEN_PARENTHESIS) || reader.error();

			// odd / even
			if (reader.currToken[0] === t.NAME && (reader.currToken[3] === 'odd' || reader.currToken[3] === 'even')) {
				element.push(stylecow.Keyword.create(reader) || reader.error());
			}

			else if (reader.currToken[0] === t.NUMBER) {
				// an (+b)
				if (reader.nextToken[0] === t.NAME && reader.nextToken[3] === 'n') {
					element.push(stylecow.Unit.create(reader) || reader.error());

					var child = stylecow.Operator.create(reader);

					if (child) {
						element.push(child);
						element.push(stylecow.Number.create(reader) || reader.error());
					}
				} else {
					element.push(stylecow.Number.create(reader) || reader.error());
				}
			}

			reader.skip(t.CLOSE_PARENTHESIS) || reader.error();

			return element;
		}
	};

	stylecow.PseudoClassPosition.prototype = Object.create(stylecow.Keyword.prototype, {
		toString: {
			value: function () {
				return ':' + (this.vendor ? '-' + this.vendor + '-' : '') + this.name + '(' + this.join(' ') + ')';
			}
		}
	});
})(require('../../index'));
