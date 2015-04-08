(function (stylecow) {

	stylecow.PseudoClassPosition = function () {
		this.class = 'PseudoClassPosition';
		this.type = 'PseudoClass';
	};

	stylecow.PseudoClassPosition.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.COLON && reader.nextToken[0] === t.NAME && reader.nextToken[3].match(/^(-(\w+)-)?(nth-.+)$/)) {
			var element = (new stylecow.PseudoClassPosition())
				.setSource(reader)
				.setNameWithVendor(reader.nextToken[3]);

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

					//n+1 can be tokenized as n1
					if (reader.currToken[0] === t.NUMBER) {
						element.push(new stylecow.Operator('+'));
						element.push(stylecow.Number.create(reader) || reader.error());
					} else {
						var child = stylecow.Operator.create(reader);

						if (child) {
							element.push(child);
							element.push(stylecow.Number.create(reader) || reader.error());
						}
					}
				} else {
					element.push(stylecow.Number.create(reader) || reader.error());
				}
			}

			reader.skip(t.CLOSE_PARENTHESIS) || reader.error();

			return element;
		}
	};

	stylecow.PseudoClassPosition.prototype = Object.create(stylecow.prototypes.NodeCollectionWithNameAndVendor, {
		toString: {
			value: function () {
				return ':' + this.getNameWithVendor() + '(' + this.join(' ') + ')';
			}
		}
	});
})(require('../../index'));
