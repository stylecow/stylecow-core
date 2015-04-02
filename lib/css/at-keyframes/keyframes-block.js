(function (stylecow) {

	stylecow.KeyframesBlock = function () {
		this.class = 'KeyframesBlock';
		this.type = 'KeyframesBlock';
	};

	stylecow.KeyframesBlock.create = function (reader) {
		var t = stylecow.Tokens;

		reader.skipWhitespace();

		if (reader.currToken[0] === t.OPEN_CURLY_BRACKET) {
			var element = new stylecow.KeyframesBlock();

			reader.next(true);

			while (reader.currToken[0] !== t.CLOSE_CURLY_BRACKET) {
				element.push(stylecow.Keyframe.create(reader) || reader.error());
				reader.skipWhitespace();
			}

			reader.next();

			return element;
		}
	};

	stylecow.KeyframesBlock.prototype = Object.create(stylecow.Block.prototype);
})(require('../../index'));
