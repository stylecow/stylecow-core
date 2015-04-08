(function (stylecow) {

	stylecow.IdSelector = function () {
		this.class = 'IdSelector';
		this.type = 'IdSelector';
	};

	stylecow.IdSelector.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.HASH) {
			return (new stylecow.IdSelector())
				.setSource(reader)
				.set('name', reader.getAndMove()[3]);
		}
	};

	stylecow.IdSelector.prototype = Object.create(stylecow.prototypes.NodeWithName, {
		toString: {
			value: function () {
				return '#' + this.name;
			}
		}
	});
})(require('../../index'));
