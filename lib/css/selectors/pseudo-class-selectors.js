(function (stylecow) {

	stylecow.PseudoClassSelectors = function (name) {
		this.class = 'PseudoClassSelectors';
		this.type = 'PseudoClass';
		this.setFullName(name);
	};

	stylecow.PseudoClassSelectors.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.COLON && reader.nextToken[0] === t.NAME && reader.nextToken[3].match(/^(-(\w+)-)?(not|matches|has)$/)) {
			reader.move();

			var element = new stylecow.PseudoClassSelectors(reader.getAndMove()[3]);

			reader.skip(t.OPEN_PARENTHESIS) || reader.error();

			do {
				element.push(stylecow.Selector.create(reader) || reader.error());
			} while (reader.currToken[0] === t.COMMA && reader.move());

			reader.skip(t.CLOSE_PARENTHESIS) || reader.error();

			return element;
		}
	};

	stylecow.PseudoClassSelectors.prototype = Object.create(stylecow.Keyword.prototype, {
		toString: {
			value: function () {
				return ':' + (this.vendor ? '-' + this.vendor + '-' : '') + this.name + '(' + this.join(', ') + ')';
			}
		}
	});
})(require('../../index'));
