(function (stylecow) {

	stylecow.String = function (name) {
		this.class = 'String';
		this.type = 'String';
		this.name = name;
	};

	stylecow.String.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.STRING) {
			return new stylecow.String(reader.getAndMove()[3]);
		}
	};

	stylecow.String.prototype = Object.create(stylecow.prototypes.NodeWithName, {
		toString: {
			value: function () {
				return '"' + this.name.replace(/"/g, '\\"') + '"';
			}
		}
	});
})(require('../index'));
