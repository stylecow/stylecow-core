(function (stylecow) {

	stylecow.Selectors = function () {
		this.class = 'Selectors';
		this.type = 'Selectors';
	};

	stylecow.Selectors.create = function (reader) {
		var t = stylecow.Tokens;
		var element = new stylecow.Selectors();

		do {
			element.push(stylecow.Selector.create(reader) || reader.error());
		} while (reader.currToken[0] === t.COMMA && reader.move());

		return element;
	};

	stylecow.Selectors.prototype = Object.create(stylecow.prototypes.NodeCollection, {
		toString: {
			value: function () {
				return this.join(', ');
			}
		}
	});
})(require('../../index'));
