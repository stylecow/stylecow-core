(function (stylecow) {

	stylecow.AttributeSelector = function (name) {
		this.class = 'AttributeSelector';
		this.type = 'AttributeSelector';
	};

	stylecow.AttributeSelector.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.OPEN_SQUARE_BRACKET) {
			reader.move();

			var element = new stylecow.AttributeSelector();

			//Attribute name
			element.push(stylecow.Keyword.create(reader) || reader.error());

			//Match combinator
			if (reader.currToken[0] !== t.CLOSE_SQUARE_BRACKET) {
				element.push(stylecow.MatchCombinator.create(reader) || reader.error());
				element.push(stylecow.String.create(reader) || reader.error());
			}

			reader.skip(t.CLOSE_SQUARE_BRACKET) || reader.error();
		
			return element;
		}
	};

	stylecow.AttributeSelector.prototype = Object.create(stylecow.prototypes.NodeCollection, {
		toString: {
			value: function () {
				return '[' + this.join('') + ']';
			}
		}
	});
})(require('../../index'));
