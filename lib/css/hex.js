(function (stylecow) {

	stylecow.Hex = function () {
		this.class = 'Hex';
		this.type = 'Hex';
	};

	stylecow.Hex.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.HASH) {
			if (/^[0-9a-fA-F]+$/.test(reader.currToken[3])) {
				return (new stylecow.Hex())
					.setSource(reader)
					.set('name', reader.getAndMove()[3]);
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
