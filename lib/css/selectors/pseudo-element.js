(function (stylecow) {

	stylecow.PseudoElement = function () {
		this.class = 'PseudoElement';
		this.type = 'PseudoElement';
	};

	stylecow.PseudoElement.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.COLON && reader.nextToken[0] === t.COLON && reader.get(1)[0] === t.NAME) {
			reader.move();
			reader.move();

			return (new stylecow.PseudoElement())
				.setSource(reader)
				.setNameWithVendor(reader.getAndMove()[3]);
		}
	};

	stylecow.PseudoElement.prototype = Object.create(stylecow.prototypes.NodeWithNameAndVendor, {
		toString: {
			value: function () {
				return '::' + this.getNameWithVendor();
			}
		},

		toCode: {
			value: function (code) {
				code.append(this.toString(), this);
			}
		}
	});
})(require('../../index'));
