(function (stylecow) {

	stylecow.Important = function () {
		this.class = 'Important';
		this.type = 'Important';
	};

	stylecow.Important.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.EXCLAMATION && reader.nextToken[0] === t.NAME && reader.nextToken[3] === 'important') {
			reader.move();
			reader.move();
			return new stylecow.Important();
		}
	};

	stylecow.Important.prototype = Object.create(stylecow.prototypes.Node, {
		toString: {
			value: function () {
				return '!important';
			}
		}
	});
})(require('../index'));
