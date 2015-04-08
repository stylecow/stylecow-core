(function (stylecow) {

	stylecow.KeyframesBlock = function () {
		this.class = 'KeyframesBlock';
		this.type = 'KeyframesBlock';
	};

	stylecow.KeyframesBlock.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.OPEN_CURLY_BRACKET) {
			var element = new stylecow.KeyframesBlock();

			reader.move();

			while (reader.currToken[0] !== t.CLOSE_CURLY_BRACKET) {
				element.push(
						stylecow.Comment.create(reader)
					 || stylecow.Keyframe.create(reader)
					 || reader.error()
				);
			}

			reader.move();

			return element;
		}
	};

	stylecow.KeyframesBlock.prototype = Object.create(stylecow.prototypes.NodeCollection, {
		toString: {
			value: function () {
				return "{\n\t" + this.join("\n").replace(/\n/g, "\n\t") + "\n}";
			}
		}
	});
})(require('../../index'));
