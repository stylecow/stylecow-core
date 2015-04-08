(function (stylecow) {

	stylecow.Number = function () {
		this.class = 'Number';
		this.type = 'Number';
	};

	stylecow.Number.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.NUMBER) {
			return (new stylecow.Number)
				.setSource(reader)
				.set('name', reader.getAndMove()[3]);
		}
	};

	stylecow.Number.prototype = Object.create(stylecow.prototypes.NodeWithName, {
		toString: {
			value: function () {
				return '' + this.name;
			}
		}
	});
})(require('../index'));
