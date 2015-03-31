(function (stylecow) {

	stylecow.Selector = function () {
		this.class = 'Selector';
		this.type = 'Selector';
	};

	stylecow.Selector.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.WHITESPACE) {
			reader.next();
		}

		var element;

		do {
			var child = stylecow.TypeSelector.create(reader)
					|| stylecow.ClassSelector.create(reader)
					|| stylecow.IdSelector.create(reader)
					|| stylecow.PseudoClass.create(reader)
					|| stylecow.PseudoElement.create(reader)
					|| stylecow.Combinator.create(reader);

			if (!child) {
				break;
			}

			if (!element) {
				element = new stylecow.Selector();
			}

			element.push(child);

		} while (reader.currToken[0] !== t.COMMA);

		if (element && element[element.length - 1].type === 'Combinator' && element[element.length - 1].name === ' ') {
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
})(require('../index'));
