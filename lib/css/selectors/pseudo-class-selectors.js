(function (stylecow) {

	stylecow.PseudoClassSelectors = function () {
		this.class = 'PseudoClassSelectors';
		this.type = 'PseudoClass';
	};

	stylecow.PseudoClassSelectors.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.COLON && reader.nextToken[0] === t.NAME && reader.nextToken[3].match(/^(-(\w+)-)?(not|matches|has)$/)) {
			reader.move();

			var element = (new stylecow.PseudoClassSelectors())
				.setSource(reader)
				.setNameWithVendor(reader.getAndMove()[3]);

			reader.skip(t.OPEN_PARENTHESIS) || reader.error();

			do {
				element.push(stylecow.Selector.create(reader) || reader.error());
			} while (reader.currToken[0] === t.COMMA && reader.move());

			reader.skip(t.CLOSE_PARENTHESIS) || reader.error();

			return element;
		}
	};

	stylecow.PseudoClassSelectors.prototype = Object.create(stylecow.prototypes.NodeCollectionWithNameAndVendor, {
		toString: {
			value: function () {
				return ':' + this.getNameWithVendor() + '(' + this.join(', ') + ')';
			}
		}
	});
})(require('../../index'));
