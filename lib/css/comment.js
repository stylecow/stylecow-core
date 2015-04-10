(function (stylecow) {

	stylecow.Comment = function () {
		this.class = 'Comment';
		this.type = 'Comment';
	};

	stylecow.Comment.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.COMMENT) {
			return (new stylecow.Comment())
				.setSource(reader)
				.set('name', reader.getAndMove()[3]);
		}
	};

	stylecow.Comment.prototype = Object.create(stylecow.prototypes.NodeWithName, {
		toString: {
			value: function () {
				return '/*' + this.name + '*/';
			}
		},

		toCode: {
			value: function (code) {
				if (code.style['comments'] === 'all' || (code.style['comments'] === 'important' && this.name[0] === '!')) {
					code.appendStyle('comment-before');
					code.append(this.toString(), this);
					code.appendStyle('comment-after');
				}
			}
		}
	});
})(require('../index'));
