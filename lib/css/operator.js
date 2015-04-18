(function (stylecow) {

	stylecow.Operator = function () {
		this.class = 'Operator';
		this.type = 'Operator';
		this.data = {};
	};

	stylecow.Operator.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.PLUS) {
			reader.move();
			return (new stylecow.Operator)
				.setSource(reader)
				.setName('+');
		}

		if (reader.currToken[0] === t.MINUS) {
			reader.move();
			return (new stylecow.Operator)
				.setSource(reader)
				.setName('-');
		}

		if (reader.currToken[0] === t.ASTERISK) {
			reader.move();
			return (new stylecow.Operator)
				.setSource(reader)
				.setName('*');
		}

		if (reader.currToken[0] === t.SOLIDUS) {
			reader.move();
			return (new stylecow.Operator)
				.setSource(reader)
				.setName('/');
		}
	};

	stylecow.Operator.prototype = Object.create(stylecow.prototypes.NodeWithName, {
		toString: {
			value: function () {
				return this.name;
			}
		},

		toCode: {
			value: function (code) {
				code.append(this.toString());
			}
		}
	});
})(require('../index'));
