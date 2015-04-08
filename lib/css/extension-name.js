(function (stylecow) {

	stylecow.ExtensionName = function () {
		this.class = 'ExtensionName';
		this.type = 'ExtensionName';
	};

	stylecow.ExtensionName.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.NAME && reader.currToken[3].substr(0, 2) === '--') {
			return (new stylecow.ExtensionName())
				.setSource(reader)
				.set('name', reader.getAndMove()[3]);
		}
	};

	stylecow.ExtensionName.prototype = Object.create(stylecow.prototypes.NodeWithName, {
		toString: {
			value: function () {
				return this.name;
			}
		}
	});
})(require('../index'));
