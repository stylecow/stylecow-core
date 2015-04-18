(function (stylecow) {

	stylecow.UniversalSelector = function () {
		this.class = 'UniversalSelector';
		this.type = 'UniversalSelector';
		this.data = {};
	};

	stylecow.UniversalSelector.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.ASTERISK) {
			reader.move();

			return (new stylecow.UniversalSelector()).setSource(reader);
		}
	};

	stylecow.UniversalSelector.prototype = Object.create(stylecow.prototypes.Node, {
		toString: {
			value: function () {
				return '*';
			}
		},

		toCode: {
			value: function (code) {
				code.append(this.toString(), this);
			}
		}
	});
})(require('../../index'));