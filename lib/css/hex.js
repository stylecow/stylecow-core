(function (stylecow) {

	stylecow.Hex = function (name) {
		this.class = 'Hex';
		this.type = 'Hex';
		this.name = name;
	};

	stylecow.Hex.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.HASH) {
			if (/^[0-9a-fA-F]+$/.test(reader.currToken[3])) {
				return new stylecow.Hex(reader.getAndMove()[3]);
			}

			reader.error();
		}
	};

	stylecow.Hex.prototype = Object.create(stylecow.prototypes.NodeWithName, {
		toString: {
			value: function () {
				return '#' + this.name;
			}
		}
	});
})(require('../index'));
