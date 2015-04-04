(function (stylecow) {

	stylecow.Hex = function (name) {
		this.class = 'Hex';
		this.type = 'Hex';
		this.name = name;
	};

	stylecow.Hex.create = function (reader) {
		var t = stylecow.Tokens;

		reader.skipWhitespace();

		if (reader.currToken[0] === t.HASH) {
			if (/^[0-9a-fA-F]+$/.test(reader.currToken[3])) {
				var element = new stylecow.Hex(reader.currToken[3]);
				reader.next();

				return element;
			}

			reader.error();
		}
	};

	stylecow.Hex.prototype = Object.create(stylecow.Base, {
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
