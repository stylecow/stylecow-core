(function (stylecow) {

	stylecow.Bang = function () {
		this.class = 'Bang';
		this.type = 'Bang';
		this.data = {};
	};

	stylecow.Bang.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.EXCLAMATION) {
			reader.move();

			reader.skipAll(t.COMMENT);

			if (reader.currToken[0] !== t.NAME) {
				reader.error();
			}

			return (new stylecow.Bang())
				.setSource(reader)
				.setName(reader.getAndMove()[3]);
		}
	};

	stylecow.Bang.prototype = Object.create(stylecow.prototypes.NodeWithName, {
		toString: {
			value: function () {
				return '!' + this.name;
			}
		},

		toCode: {
			value: function (code) {
				code.append(this.toString(), this);
			}
		}
	});
})(require('../index'));
