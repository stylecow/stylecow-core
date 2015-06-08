(function (stylecow) {

	stylecow.Expression = function () {
		this.class = 'Expression';
		this.type = 'Expression';
		this.data = {};
	};

	stylecow.Expression.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.OPEN_PARENTHESIS) {
			var element = (new stylecow.Expression()).setSource(reader);

			reader.move();

			do {
				element.push(stylecow.Unit.create(reader)
					|| stylecow.Number.create(reader)
					|| stylecow.Operator.create(reader)
					|| stylecow.Expression.create(reader)
					|| stylecow.Function.create(reader)
					|| reader.error());

			} while (reader.currToken[0] !== t.CLOSE_PARENTHESIS && reader.currToken[0] !== t.EOF);

			reader.skip(t.CLOSE_PARENTHESIS) || reader.error();

			return element;
		}
	};

	stylecow.Expression.prototype = Object.create(stylecow.prototypes.NodeCollection, {
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

					if (latest !== k) {
						code.append(' ');
					}
				});

				code.append(')');
			}
		}
	});
})(require('../index'));
