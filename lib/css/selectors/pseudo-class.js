(function (stylecow) {

	stylecow.PseudoClass = function () {
		this.class = 'PseudoClass';
		this.type = 'PseudoClass';
	};

	stylecow.PseudoClass.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.COLON && reader.nextToken[0] === t.NAME) {
			reader.move();

			return (new stylecow.PseudoClass())
				.setSource(reader)
				.setNameWithVendor(reader.getAndMove()[3]);
		}
	};

	stylecow.PseudoClass.prototype = Object.create(stylecow.prototypes.NodeWithNameAndVendor, {
		toString: {
			value: function () {
				return ':' + this.getNameWithVendor();
			}
		}
	});
})(require('../../index'));
