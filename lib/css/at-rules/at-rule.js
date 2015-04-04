(function (stylecow) {

	stylecow.AtRule = function (name) {
		this.class = 'AtRule';
		this.type = 'AtRule';
		this.setFullName(name);
	};

	stylecow.AtRule.create = function (reader) {
		var t = stylecow.Tokens;

		reader.skipWhitespace();

		if (reader.currToken[0] === t.AT && reader.nextToken[0] === t.NAME) {
			var element = new stylecow.AtRule(reader.nextToken[3]);
			reader.next();
			reader.next(true);

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
			else if (element.name === 'page') {
				element.push(stylecow.Selectors.create(reader) || reader.error());
			}

			element.push(stylecow.Block.create(reader) || reader.error());

			reader.skipWhitespace();

			return element;
		}
	};

	stylecow.AtRule.prototype = Object.create(stylecow.Keyword.prototype, {
		toString: {
			value: function () {
				return '@' + (this.vendor ? '-' + this.vendor + '-' : '') + this.name + ' ' + this.join(' ');
			}
		},

		toCode: {
			value: function (code) {
				code.append(this.name + code.style.ruleColon, this);

				var latest = this.length - 1;

				this.forEach(function (child, k) {
					child.toCode(code);

					if (k !== latest) {
						code.append(code.style.valueJoiner);
					}
				});

				code.append(code.style.ruleEnd);
			}
		}
	});
})(require('../../index'));
