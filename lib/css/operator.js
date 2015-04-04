(function (stylecow) {

	stylecow.Operator = function (name) {
		this.class = 'Operator';
		this.type = 'Operator';
		this.name = name;
	};

	stylecow.Operator.create = function (reader) {
		var t = stylecow.Tokens;

		reader.skipWhitespace();

		if (reader.currToken[0] === t.PLUS) {
			reader.next();
			return new stylecow.Operator('+');
		}

		if (reader.currToken[0] === t.MINUS) {
			reader.next();
			return new stylecow.Operator('-');
		}

		if (reader.currToken[0] === t.ASTERISK) {
			reader.next();
			return new stylecow.Operator('*');
		}

		if (reader.currToken[0] === t.SOLIDUS) {
			reader.next();
			return new stylecow.Operator('/');
		}
	};

	stylecow.Operator.prototype = Object.create(stylecow.Base, {
		toString: {
			value: function () {
				return this.name;
			}
		},

		toCode: {
			value: function (code) {
				code.append(this.toString(), this);
			}
		}
	});
})(require('../index'));
