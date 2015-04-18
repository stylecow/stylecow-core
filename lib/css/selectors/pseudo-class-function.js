(function (stylecow) {

	stylecow.PseudoClassFunction = function () {
		this.class = 'PseudoClassFunction';
		this.type = 'PseudoClass';
		this.data = {};
	};

	stylecow.PseudoClassFunction.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.COLON && reader.nextToken[0] === t.NAME && reader.get(1)[0] === t.OPEN_PARENTHESIS) {
			reader.move();

			var element = (new stylecow.PseudoClassFunction())
				.setSource(reader)
				.setNameWithVendor(reader.getAndMove()[3]);

			reader.skip(t.OPEN_PARENTHESIS) || reader.error();

			do {
				element.push(stylecow.Value.create(reader) || reader.error());
			} while (reader.currToken[0] === t.COMMA && reader.move());

			reader.skip(t.CLOSE_PARENTHESIS) || reader.error();

			return element;
		}
	};

	stylecow.PseudoClassFunction.createSelectors = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.COLON && reader.nextToken[0] === t.NAME && reader.nextToken[3].match(/^(-(\w+)-)?(not|matches|has)$/)) {
			reader.move();

			var element = (new stylecow.PseudoClassFunction())
				.setSource(reader)
				.setNameWithVendor(reader.getAndMove()[3]);

			reader.skip(t.OPEN_PARENTHESIS) || reader.error();

			do {
				element.push(stylecow.Selector.create(reader) || reader.error());
			} while (reader.currToken[0] === t.COMMA && reader.move());

			reader.skip(t.CLOSE_PARENTHESIS) || reader.error();

			return element;
		}
	};

	stylecow.PseudoClassFunction.createPosition = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.COLON && reader.nextToken[0] === t.NAME && reader.nextToken[3].match(/^(-(\w+)-)?(nth-.+)$/)) {
			var element = (new stylecow.PseudoClassFunction())
				.setSource(reader)
				.setNameWithVendor(reader.nextToken[3]);

			reader.move();
			reader.move();

			reader.skip(t.OPEN_PARENTHESIS) || reader.error();

			var value = (new stylecow.Value()).setSource(reader);
			element.push(value);

			// odd / even
			if (reader.currToken[0] === t.NAME && (reader.currToken[3] === 'odd' || reader.currToken[3] === 'even')) {
				value.push(stylecow.Keyword.create(reader) || reader.error());
			// an+b
			} else {
				if (reader.currToken[0] === t.NUMBER && reader.nextToken[0] === t.NAME && reader.nextToken[3] === 'n') {
					value.push(stylecow.Unit.create(reader) || reader.error());
				} else if (reader.currToken[0] === t.NAME && reader.currToken[3] === 'n') {
					var unit = (new stylecow.Unit())
						.setSource(reader)
						.setName(reader.getAndMove()[3]);

					unit.push((new stylecow.Number())
						.setSource(reader)
						.setName(1)
					);

					value.push(unit);
				} else {
					value.push(stylecow.Number.create(reader) || reader.error());
				}

				//n+1 can be tokenized as n1
				if (reader.currToken[0] === t.NUMBER) {
					value.push((new stylecow.Operator())
						.setSource(reader)
						.setName('+')
					);
					value.push(stylecow.Number.create(reader) || reader.error());
				} else {
					var child = stylecow.Operator.create(reader);

					if (child) {
						value.push(child);
						value.push(stylecow.Number.create(reader) || reader.error());
					}
				}
			}

			reader.skip(t.CLOSE_PARENTHESIS) || reader.error();

			return element;
		}
	};

	stylecow.PseudoClassFunction.prototype = Object.create(stylecow.prototypes.NodeCollectionWithNameAndVendor, {
		toString: {
			value: function () {
				return ':' + this.getNameWithVendor() + '(' + this.join(', ') + ')';
			}
		},

		toCode: {
			value: function (code) {
				code.append(':' + this.getNameWithVendor() + '(', this);
				code.appendStyle('function-opening-parenthesis-after');

				var latest = this.length - 1;

				this.forEach(function (child, k) {
					child.toCode(code);

					if (k !== latest) {
						code.appendStyle('function-comma-before');
						code.append(',');
						code.appendStyle('function-comma-after');
					}
				});

				code.appendStyle('function-closing-parenthesis-before');
				code.append(')');
			}
		}
	});
})(require('../../index'));
