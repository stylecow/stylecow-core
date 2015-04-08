(function (stylecow) {

	stylecow.DeclarationBlock = function () {
		this.class = 'DeclarationBlock';
		this.type = 'Block';
	};

	stylecow.DeclarationBlock.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.OPEN_CURLY_BRACKET) {
			var element = (new stylecow.DeclarationBlock()).setSource(reader);

			reader.move();

			while (reader.currToken[0] !== t.CLOSE_CURLY_BRACKET) {
				element.push(
						stylecow.Comment.create(reader)
					 || stylecow.Declaration.createMsFilter(reader)
					 || stylecow.Declaration.create(reader)
					 || reader.error()
				);
			}

			reader.move();

			return element;
		}
	};

	stylecow.DeclarationBlock.prototype = Object.create(stylecow.prototypes.NodeCollection, {
		toString: {
			value: function () {
				return "{\n\t" + this.join("\n").replace(/\n/g, "\n\t") + "\n}";
			}
		}
	});
})(require('../index'));
