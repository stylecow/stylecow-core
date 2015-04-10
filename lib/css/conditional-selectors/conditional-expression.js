(function (stylecow) {

	stylecow.ConditionalExpression = function () {
		this.class = 'ConditionalExpression';
		this.type = 'ConditionalExpression';
	};

	stylecow.ConditionalExpression.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.OPEN_PARENTHESIS) {
			reader.move();

			var element = (new stylecow.ConditionalExpression()).setSource(reader);

			//not|only
			if (reader.currToken[0] === t.NAME && (reader.currToken[3].toLowerCase() === 'only' || reader.currToken[3].toLowerCase() === 'not')) {
				element.push(stylecow.Keyword.create(reader) || reader.error());
			}

			while (reader.currToken[0] !== t.CLOSE_PARENTHESIS && reader.currToken[0] !== t.EOF) {
				if (reader.currToken[0] === t.OPEN_PARENTHESIS) {
					element.push(stylecow.ConditionalExpression.create(reader));
				} else if (reader.currToken[0] === t.NAME) {
					if (reader.currToken[3].toLowerCase() === 'and' || reader.currToken[3].toLowerCase() === 'or') {
						element.push(stylecow.Keyword.create(reader) || reader.error());
					} else {
						element.push(stylecow.ConditionalFeature.create(reader) || reader.error());
					}
				} else {
					reader.error();
				}
			}

			reader.move();

			return element;
		}
	};

	stylecow.ConditionalExpression.prototype = Object.create(stylecow.prototypes.NodeCollection, {
		toString: {
			value: function () {
				return '(' + this.join(' ') + ')';
			}
		},

		toCode: {
			value: function (code) {
				code.append('(');

				var latest = this.length - 1;

				this.forEach(function (child, k) {
					child.toCode(code);

					if (k !== latest) {
						code.append(' ');
					}
				});
				
				code.append(')');
			}
		}
	});
})(require('../../index'));
