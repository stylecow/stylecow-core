(function (stylecow) {

	stylecow.TypeSelector = function (name) {
		this.class = 'TypeSelector';
		this.type = 'TypeSelector';
		this.name = name;
	};

	stylecow.TypeSelector.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.NAME) {
			return new stylecow.TypeSelector(reader.getAndMove()[3]);
		}
	};

	stylecow.TypeSelector.prototype = Object.create(stylecow.Base, {
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
