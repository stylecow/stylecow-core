(function (stylecow) {

	stylecow.KeyframeBlock = function () {
		this.class = 'KeyframeBlock';
		this.type = 'KeyframeBlock';
	};

	stylecow.KeyframeBlock.create = function (reader) {
		var t = stylecow.Tokens;

		reader.skipWhitespace();

		if (reader.currToken[0] === t.OPEN_CURLY_BRACKET) {
			var element = new stylecow.KeyframeBlock();

			reader.next(true);

			while (reader.currToken[0] !== t.CLOSE_CURLY_BRACKET) {
				element.push(stylecow.Declaration.create(reader) || reader.error());
				reader.skipWhitespace();
			}

			reader.next();

			return element;
		}
	};

	stylecow.KeyframeBlock.prototype = Object.create(stylecow.Block.prototype);
})(require('../../index'));
