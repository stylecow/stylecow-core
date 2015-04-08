(function (stylecow) {

	stylecow.Function = function () {
		this.class = 'Function';
		this.type = 'Function';
	};

	stylecow.Function.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.NAME && reader.nextToken[0] === t.OPEN_PARENTHESIS) {
			var element = (new stylecow.Function())
				.setSource(reader)
				.set('name', reader.currToken[3]);

			reader.move();
			reader.move();

			do {
				element.push(stylecow.Value.create(reader) || reader.error());

			} while (reader.currToken[0] === t.COMMA && reader.move());

			reader.skip(t.CLOSE_PARENTHESIS) || reader.error();

			return element;
		}
	};

	stylecow.Function.prototype = Object.create(stylecow.prototypes.NodeCollectionWithNameAndVendor, {
		toString: {
			value: function () {
				return this.getNameWithVendor() + '(' + this.join(', ') + ')';
			}
		}
	});
})(require('../index'));
