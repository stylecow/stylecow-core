(function (stylecow) {

	stylecow.PseudoClassSelectors = function (name) {
		this.class = 'PseudoClassSelectors';
		this.type = 'PseudoClass';
		this.setFullName(name);
	};

	stylecow.PseudoClassSelectors.create = function (reader) {
		var t = stylecow.Tokens;

		reader.skipWhitespace();
		
		if (reader.currToken[0] === t.COLON && reader.nextToken[0] === t.NAME && reader.get(1)[0] === t.OPEN_PARENTHESIS && reader.nextToken[3].match(/^(-(\w+)-)?(not|matches|has)$/)) {
			var element = new stylecow.PseudoClassSelectors(reader.nextToken[3]);
			reader.next();
			reader.next();
			reader.next();

			do {
				element.push(stylecow.Selector.create(reader) || reader.error());
				reader.skipWhitespace();
			} while (reader.currToken[0] === t.COMMA && reader.next());

			if (reader.currToken[0] !== t.CLOSE_PARENTHESIS) {
				return reader.error();
			}

			reader.next();

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
