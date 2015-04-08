(function (stylecow) {

	stylecow.Comment = function (name) {
		this.class = 'Comment';
		this.type = 'Comment';
		this.name = name;
	};

	stylecow.Comment.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.COMMENT) {
			return new stylecow.Comment(reader.getAndMove()[3]);
		}
	};

	stylecow.Comment.prototype = Object.create(stylecow.prototypes.NodeWithName, {
		toString: {
			value: function () {
				return '/*' + this.name + '*/';
			}
		}
	});
})(require('../index'));
