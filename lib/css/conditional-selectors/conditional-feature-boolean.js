(function (stylecow) {

	stylecow.ConditionalFeatureBoolean = function () {
		this.class = 'ConditionalFeatureBoolean';
		this.type = 'ConditionalFeatureBoolean';
		this.data = {};
	};

	stylecow.ConditionalFeatureBoolean.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.NAME && reader.getNextToken()[0] === t.CLOSE_PARENTHESIS) {
			return (new stylecow.ConditionalFeatureBoolean())
				.setSource(reader)
				.setName(reader.getAndMove()[3]);
		}
	};

	stylecow.ConditionalFeatureBoolean.prototype = Object.create(stylecow.prototypes.NodeWithName, {
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
