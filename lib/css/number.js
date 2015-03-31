(function (stylecow) {

	stylecow.Number = function (name) {
		this.class = 'Number';
		this.type = 'Number';
		this.name = name;
	};

	stylecow.Number.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.NUMBER) {
			var element = new stylecow.Number(reader.currToken[3]);
			reader.next();
			return element;
		}
	};

	stylecow.Number.prototype = Object.create(stylecow.Base, {
		toString: {
			value: function () {
				return '' + this.name;
			}
		},

		toCode: {
			value: function (code) {
				code.append(this.toString(), this);
			}
		}
	});
})(require('../index'));
