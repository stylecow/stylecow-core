(function (stylecow) {

	stylecow.Selector = function () {
		this.class = 'Selector';
		this.type = 'Selector';
	};

	stylecow.Selector.create = function (reader) {
		var t = stylecow.Tokens;

		var element = new stylecow.Selector();

		do {
			if (reader.currToken[0] === t.CLOSE_PARENTHESIS || reader.currToken[0] === t.OPEN_CURLY_BRACKET) {
				break;
			}

			element.push(stylecow.TypeSelector.create(reader)
				|| stylecow.Comment.create(reader)
				|| stylecow.AttributeSelector.create(reader)
				|| stylecow.UniversalSelector.create(reader)
				|| stylecow.ClassSelector.create(reader)
				|| stylecow.IdSelector.create(reader)
				|| stylecow.PseudoClassSelectors.create(reader)
				|| stylecow.PseudoClass.create(reader)
				|| stylecow.PseudoElement.create(reader)
				|| reader.error()
			);

			var child = stylecow.Combinator.create(reader);

			if (child) {
				element.push(child);
			}

		} while (reader.currToken[0] !== t.COMMA && reader.currToken[0] !== t.EOF);

		if (!element.length) {
			reader.error();
		}

		//Remove the last combinator if it's a space
		if (element.length && element[element.length - 1].type === 'Combinator' && element[element.length - 1].name === ' ') {
			element.pop();
		}

		return element;
	};

	stylecow.Selector.prototype = Object.create(stylecow.Base, {
		toString: {
			value: function () {
				return this.join('');
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
