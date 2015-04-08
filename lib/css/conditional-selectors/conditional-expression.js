(function (stylecow) {

	stylecow.ConditionalExpression = function (name) {
		this.class = 'ConditionalExpression';
		this.type = 'ConditionalExpression';
	};

	stylecow.ConditionalExpression.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.OPEN_PARENTHESIS) {
			reader.move();

			var element = new stylecow.ConditionalExpression();

			//not|only
			if (reader.currToken[0] === t.NAME && (reader.currToken[3] === 'only' || reader.currToken[3] === 'not')) {
				element.push(stylecow.Keyword.create(reader) || reader.error());
			}

			while (reader.currToken[0] !== t.CLOSE_PARENTHESIS && reader.currToken[0] !== t.EOF) {
				if (reader.currToken[0] === t.OPEN_PARENTHESIS) {
					element.push(stylecow.ConditionalExpression.create(reader));
				} else if (reader.currToken[0] === t.NAME) {
					if (reader.currToken[3] === 'and' || reader.currToken[3] === 'or') {
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
		}
	});
})(require('../../index'));
