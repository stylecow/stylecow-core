(function (stylecow) {

	stylecow.PseudoElement = function (name) {
		this.class = 'PseudoElement';
		this.type = 'PseudoElement';
		this.setNameWithVendor(name);
	};

	stylecow.PseudoElement.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.COLON && reader.nextToken[0] === t.COLON && reader.get(1)[0] === t.NAME) {
			reader.move();
			reader.move();
			return new stylecow.PseudoElement(reader.getAndMove()[3]);
		}
	};

	stylecow.PseudoElement.prototype = Object.create(stylecow.prototypes.NodeWithNameAndVendor, {
		toString: {
			value: function () {
				return '::' + this.getNameWithVendor();
			}
		}
	});
})(require('../../index'));
