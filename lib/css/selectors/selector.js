(function (stylecow) {

	stylecow.Selector = function () {
		this.class = 'Selector';
		this.type = 'Selector';
		this.data = {};
	};

	stylecow.Selector.create = function (reader) {
		var t = stylecow.Tokens;
		var element = (new stylecow.Selector()).setSource(reader);

		//Start by a combinator?
		var child = stylecow.Combinator.create(reader);

		if (child) {
			element.push(child);
		}

		do {
			if (reader.currToken[0] === t.CLOSE_PARENTHESIS || reader.currToken[0] === t.OPEN_CURLY_BRACKET || reader.currToken[0] === t.SEMICOLON) {
				break;
			}

			element.push(stylecow.ExtensionName.create(reader)
				|| stylecow.ExtensionName.createFromCustomSelector(reader)
				|| stylecow.TypeSelector.create(reader)
				|| stylecow.Comment.create(reader)
				|| stylecow.AttributeSelector.create(reader)
				|| stylecow.UniversalSelector.create(reader)
				|| stylecow.ClassSelector.create(reader)
				|| stylecow.IdSelector.create(reader)
				|| stylecow.PseudoClassFunction.createSelectors(reader)
				|| stylecow.PseudoClassFunction.createPosition(reader)
				|| stylecow.PseudoClass.create(reader)
				|| stylecow.PseudoElement.create(reader)
				|| stylecow.PlaceholderSelector.create(reader)
				|| stylecow.Combinator.createJoinCombinator(reader)
				|| reader.error()
			);

			child = stylecow.Combinator.create(reader);

			if (child) {
				element.push(child);
			}
		} while (reader.currToken[0] !== t.COMMA && reader.currToken[0] !== t.EOF);

		if (!element.length) {
			reader.error();
		}

		//Remove the first and last combinators if it's a space
		if (element.length && element[0].type === 'Combinator' && element[0].name === ' ') {
			element.shift();
		}

		if (element.length && element[element.length - 1].type === 'Combinator' && element[element.length - 1].name === ' ') {
			element.pop();
		}

		return element;
	};

	stylecow.Selector.prototype = Object.create(stylecow.prototypes.NodeCollection, {
		toString: {
			value: function () {
				return this.join('');
			}
		},

		toCode: {
			value: function (code) {
				this.forEach(function (child) {
					child.toCode(code);
				});
			}
		}
	});
})(require('../../index'));
