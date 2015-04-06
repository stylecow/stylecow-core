(function (stylecow) {

	stylecow.IdSelector = function (name) {
		this.class = 'IdSelector';
		this.type = 'IdSelector';
		this.name = name;
	};

	stylecow.IdSelector.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.HASH) {
			return new stylecow.IdSelector(reader.getAndMove()[3]);
		}
	};

	stylecow.IdSelector.prototype = Object.create(stylecow.TypeSelector.prototype, {
		toString: {
			value: function () {
				return '#' + this.name;
			}
		}
	});
})(require('../../index'));
