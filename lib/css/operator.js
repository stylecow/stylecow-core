(function (stylecow) {

	stylecow.Operator = function (name) {
		this.class = 'Operator';
		this.type = 'Operator';
		this.name = name;
	};

	stylecow.Operator.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.PLUS) {
			reader.move();
			return new stylecow.Operator('+');
		}

		if (reader.currToken[0] === t.MINUS) {
			reader.move();
			return new stylecow.Operator('-');
		}

		if (reader.currToken[0] === t.ASTERISK) {
			reader.move();
			return new stylecow.Operator('*');
		}

		if (reader.currToken[0] === t.SOLIDUS) {
			reader.move();
			return new stylecow.Operator('/');
		}
	};

	stylecow.Operator.prototype = Object.create(stylecow.prototypes.NodeWithName, {
		toString: {
			value: function () {
				return this.name;
			}
		}
	});
})(require('../index'));
