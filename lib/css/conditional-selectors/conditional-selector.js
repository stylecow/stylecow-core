(function (stylecow) {

	stylecow.ConditionalSelector = function () {
		this.class = 'ConditionalSelector';
		this.type = 'ConditionalSelector';
	};

	stylecow.ConditionalSelector.create = function (reader) {
		var t = stylecow.Tokens;
		var element = (new stylecow.ConditionalSelector()).setSource(reader);

		// not|only operators
		if (reader.currToken[0] === t.NAME && (reader.currToken[3] === 'only' || reader.currToken[3] === 'not')) {
			element.push(stylecow.Keyword.create(reader) || reader.error());
		}

		while (reader.currToken[0] !== t.EOT) {
			element.push(stylecow.ConditionalExpression.create(reader) || reader.error());

			// and|or
			if (reader.currToken[0] === t.NAME && (reader.currToken[3] === 'and' || reader.currToken[3] === 'or')) {
				element.push(stylecow.Keyword.create(reader) || reader.error());
			} else {
				break;
			}
		}

		return element;
	};

	stylecow.ConditionalSelector.prototype = Object.create(stylecow.prototypes.NodeCollection, {
		toString: {
			value: function () {
				return this.join(' ');
			}
		},

		toCode: {
			value: function (code) {
				var latest = this.length - 1;

				this.forEach(function (child, k) {
					child.toCode(code);

					if (k !== latest) {
						code.append(' ');
					}
				});
			}
		}
	});
})(require('../../index'));
