(function (stylecow) {

	stylecow.PseudoElement = function (name) {
		this.class = 'PseudoElement';
		this.type = 'PseudoElement';
		this.setFullName(name);
	};

	stylecow.PseudoElement.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.COLON && reader.nextToken[0] === t.COLON && reader.tokens.tokens[reader.pos + 1][0] === t.NAME) {
			reader.next();
			var element = new stylecow.PseudoElement(reader.nextToken[3]);
			reader.next();
			reader.next();

			return element;
		}
	};

	stylecow.PseudoElement.prototype = Object.create(stylecow.Keyword.prototype, {
		toString: {
			value: function () {
				if (this.vendor) {
					return '::-' + this.vendor + '-' + this.name;
				}

				return '::' + this.name;
			}
		}
	});
})(require('../index'));
