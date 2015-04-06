(function (stylecow) {

	stylecow.ValueSeparator = function () {
		this.class = 'ValueSeparator';
		this.type = 'ValueSeparator';
	};

	stylecow.ValueSeparator.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.SOLIDUS) {
			reader.move();
			return new stylecow.ValueSeparator();
		}
	};

	stylecow.ValueSeparator.prototype = Object.create(stylecow.Base, {
		toString: {
			value: function () {
				return '/';
			}
		},

		toCode: {
			value: function (code) {
				code.append(this.toString(), this);
			}
		}
	});
})(require('../index'));
