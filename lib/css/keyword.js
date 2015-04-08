(function (stylecow) {

	stylecow.Keyword = function () {
		this.class = 'Keyword';
		this.type = 'Keyword';
	};

	stylecow.Keyword.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.NAME) {
			return (new stylecow.Keyword())
				.setSource(reader)
				.setNameWithVendor(reader.getAndMove()[3]);
		}
	};

	stylecow.Keyword.prototype = Object.create(stylecow.prototypes.NodeWithNameAndVendor, {
		toString: {
			value: function () {
				return this.getNameWithVendor();
			}
		}
	});
})(require('../index'));
