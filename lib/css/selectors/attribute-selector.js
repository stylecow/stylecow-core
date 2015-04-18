(function (stylecow) {

	stylecow.AttributeSelector = function () {
		this.class = 'AttributeSelector';
		this.type = 'AttributeSelector';
		this.data = {};
	};

	stylecow.AttributeSelector.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.OPEN_SQUARE_BRACKET) {
			reader.move();

			var element = (new stylecow.AttributeSelector()).setSource(reader);

			//Attribute name
			element.push(stylecow.Keyword.create(reader) || reader.error());

			//Match combinator
			if (reader.currToken[0] !== t.CLOSE_SQUARE_BRACKET) {
				element.push(stylecow.MatchCombinator.create(reader) || reader.error());

				if (reader.currToken[0] === t.NAME) {
					element.push((new stylecow.String())
						.setSource(reader)
						.setName(reader.getAndMove()[3]) || reader.error());
				} else {
					element.push(stylecow.String.create(reader) || reader.error());
				}
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
		},

		toCode: {
			value: function (code) {
				this.forEach(function (child, k) {
					child.toCode(code);
				});
			}
		}
	});
})(require('../../index'));
