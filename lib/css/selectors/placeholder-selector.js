(function (stylecow) {

	stylecow.PlaceholderSelector = function () {
		this.class = 'PlaceholderSelector';
		this.type = 'PlaceholderSelector';
		this.data = {};
	};

	stylecow.PlaceholderSelector.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.PERCENTAGE && reader.nextToken[0] === t.NAME) {
			reader.move();

			return (new stylecow.PlaceholderSelector())
				.setSource(reader)
				.setName(reader.getAndMove()[3]);
		}
	};

	stylecow.PlaceholderSelector.prototype = Object.create(stylecow.prototypes.NodeWithName, {
		toString: {
			value: function () {
				return '%' + this.name;
			}
		},

		toCode: {
			value: function (code) {
				code.append(this.toString(), this);
			}
		}
	});
})(require('../../index'));
