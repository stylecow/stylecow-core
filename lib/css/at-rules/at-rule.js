(function (stylecow) {

	stylecow.AtRule = function () {
		this.class = 'AtRule';
		this.type = 'AtRule';
		this.data = {};
	};

	stylecow.AtRule.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.AT && reader.nextToken[0] === t.NAME) {
			reader.move();

			var element = (new stylecow.AtRule())
				.setSource(reader)
				.setNameWithVendor(reader.getAndMove()[3]);

			/*
			 * at-rules with a keyword:
			 *
			 * @counter-style
			 * @font-feature-values
			 */
			if (element.name === 'counter-style' || element.name === 'font-feature-values') {
				element.push(stylecow.Keyword.create(reader) || reader.error());
			}

			/*
			 * at-rules with selectors:
			 *
			 * @page
			 */
			else if (element.name === 'page' && reader.currToken[0] !== t.OPEN_CURLY_BRACKET) {
				element.push(stylecow.Selectors.create(reader) || reader.error());
			}

			element.push(stylecow.Block.create(reader) || reader.error());

			return element;
		}
	};

	stylecow.AtRule.prototype = Object.create(stylecow.prototypes.NodeCollectionWithNameAndVendor, {
		toString: {
			value: function () {
				return '@' + this.getNameWithVendor() + ' ' + this.join(' ');
			}
		},

		toCode: {
			value: function (code) {
				code.appendStyle('at-rule-before');
				code.append('@' + this.getNameWithVendor() + ' ', this);

				this.forEach(function (child, k) {
					child.toCode(code);
				});
				code.appendStyle('at-rule-after');
			}
		}
	});
})(require('../../index'));
