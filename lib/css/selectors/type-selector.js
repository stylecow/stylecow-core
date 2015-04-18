(function (stylecow) {

	stylecow.TypeSelector = function () {
		this.class = 'TypeSelector';
		this.type = 'TypeSelector';
		this.data = {};
	};

	stylecow.TypeSelector.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.NAME) {
			return (new stylecow.TypeSelector())
				.setSource(reader)
				.setName(reader.getAndMove()[3]);
		}
	};

	stylecow.TypeSelector.prototype = Object.create(stylecow.prototypes.NodeWithName, {
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
