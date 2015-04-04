(function (stylecow) {

	stylecow.IdSelector = function (name) {
		this.class = 'IdSelector';
		this.type = 'IdSelector';
		this.name = name;
	};

	stylecow.IdSelector.create = function (reader) {
		var t = stylecow.Tokens;

		reader.skipWhitespace();

		if (reader.currToken[0] === t.HASH) {
			var element = new stylecow.IdSelector(reader.currToken[3]);
			reader.next();

			return element;
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
