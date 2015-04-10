(function (stylecow) {

	stylecow.Selectors = function () {
		this.class = 'Selectors';
		this.type = 'Selectors';
	};

	stylecow.Selectors.create = function (reader) {
		var t = stylecow.Tokens;
		var element = (new stylecow.Selectors()).setSource(reader);

		do {
			element.push(stylecow.Selector.create(reader) || reader.error());
		} while (reader.currToken[0] === t.COMMA && reader.move());

		return element;
	};

	stylecow.Selectors.createKeyframeSelectors = function (reader) {
		var t = stylecow.Tokens;
		var element = (new stylecow.Selectors()).setSource(reader);

		do {
			if (reader.currToken[0] === t.NAME && (reader.currToken[3] === 'from' || reader.currToken[3] === 'to')) {
				element.push(stylecow.Keyword.create(reader) || reader.error());
			} else {
				element.push(stylecow.Unit.create(reader)
					 || stylecow.Number.create(reader)
					 || reader.error());
			}
		} while (reader.currToken[0] === t.COMMA && reader.move());

		return element;
	};

	stylecow.Selectors.prototype = Object.create(stylecow.prototypes.NodeCollection, {
		toString: {
			value: function () {
				return this.join(', ');
			}
		},

		toCode: {
			value: function (code) {
				var latest = this.length - 1;

				this.forEach(function (child, k) {
					child.toCode(code);

					if (k !== latest) {
						code.appendStyle('selector-comma-before');
						code.append(',');
						code.appendStyle('selector-comma-after');
					}
				});
			}
		}
	});
})(require('../../index'));
