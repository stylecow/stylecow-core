(function (stylecow) {

	stylecow.Hex = function () {
		this.class = 'Hex';
		this.type = 'Hex';
		this.data = {};
	};

	stylecow.Hex.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.HASH) {
			if (/^[0-9a-fA-F]+$/.test(reader.currToken[3])) {
				return (new stylecow.Hex())
					.setSource(reader)
					.setName(reader.getAndMove()[3]);
			}

			reader.error();
		}
	};

	stylecow.Hex.prototype = Object.create(stylecow.prototypes.NodeWithName, {
		toString: {
			value: function () {
				return '#' + this.name;
			}
		},

		toCode: {
			value: function (code) {
				code.append(this.toString(), this);
			}
		}
	});
})(require('../index'));
