(function (stylecow) {

	stylecow.UniversalSelector = function () {
		this.class = 'UniversalSelector';
		this.type = 'UniversalSelector';
	};

	stylecow.UniversalSelector.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.ASTERISK) {
			reader.move();
			return new stylecow.UniversalSelector();
		}
	};

	stylecow.UniversalSelector.prototype = Object.create(stylecow.Base, {
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
})(require('../../index'));
