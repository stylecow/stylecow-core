(function (stylecow) {

	stylecow.ValueSeparator = function () {
		this.class = 'ValueSeparator';
		this.type = 'ValueSeparator';
	};

	stylecow.ValueSeparator.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.SOLIDUS) {
			reader.move();
			return (new stylecow.ValueSeparator()).setSource(reader);
		}
	};

	stylecow.ValueSeparator.prototype = Object.create(stylecow.prototypes.Node, {
		toString: {
			value: function () {
				return '/';
			}
		}
	});
})(require('../index'));
