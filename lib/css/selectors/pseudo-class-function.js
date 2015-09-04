"use strict";

const OPEN_PARENTHESIS  = Symbol.for('OPEN_PARENTHESIS');
const CLOSE_PARENTHESIS = Symbol.for('CLOSE_PARENTHESIS');
const NAME              = Symbol.for('NAME');
const COLON             = Symbol.for('COLON');
const NUMBER            = Symbol.for('NUMBER');
const COMMA             = Symbol.for('COMMA');

var stylecow = require('../../index');

stylecow.PseudoClassFunction = class extends require('../../classes/node-collection-vendor') {

	constructor() {
		super('PseudoClass', 'PseudoClassFunction');
	}

	static create (reader) {
		if (reader.currToken === COLON && reader.nextToken === NAME && reader.get(1)[0] === OPEN_PARENTHESIS) {
			reader.move();

			var element = (new stylecow.PseudoClassFunction())
				.setSource(reader)
				.setNameWithVendor(reader.getStringAndMove());

			reader.skip(OPEN_PARENTHESIS) || reader.error();

			do {
				element.push(stylecow.Value.create(reader) || reader.error());
			} while (reader.currToken === COMMA && reader.move());

			reader.skip(CLOSE_PARENTHESIS) || reader.error();

			return element;
		}
	}

	static createSelectors (reader) {
		if (reader.currToken === COLON && reader.nextToken === NAME && reader.nextStr.match(/^(-(\w+)-)?(not|matches|has)$/)) {
			reader.move();

			var element = (new stylecow.PseudoClassFunction())
				.setSource(reader)
				.setNameWithVendor(reader.getStringAndMove());

			reader.skip(OPEN_PARENTHESIS) || reader.error();

			do {
				element.push(stylecow.Selector.create(reader) || reader.error());
			} while (reader.currToken === COMMA && reader.move());

			reader.skip(CLOSE_PARENTHESIS) || reader.error();

			return element;
		}
	}

	static createPosition (reader) {
		if (reader.currToken === COLON && reader.nextToken === NAME && reader.nextStr.match(/^(-(\w+)-)?(nth-.+)$/)) {
			var element = (new stylecow.PseudoClassFunction())
				.setSource(reader)
				.setNameWithVendor(reader.nextStr);

			reader.move();
			reader.move();

			reader.skip(OPEN_PARENTHESIS) || reader.error();

			var value = (new stylecow.Value()).setSource(reader);
			element.push(value);

			// odd / even
			if (reader.currToken === NAME && (reader.currStr === 'odd' || reader.currStr === 'even')) {
				value.push(stylecow.Keyword.create(reader) || reader.error());
			// an+b
			} else {
				if (reader.currToken === NUMBER && reader.nextToken === NAME && reader.nextStr === 'n') {
					value.push(stylecow.Unit.create(reader) || reader.error());
				} else if (reader.currToken === NAME && reader.currStr === 'n') {
					var unit = (new stylecow.Unit())
						.setSource(reader)
						.setName(reader.getStringAndMove());

					unit.push((new stylecow.Number())
						.setSource(reader)
						.setName(1)
					);

					value.push(unit);
				} else {
					value.push(stylecow.Number.create(reader) || reader.error());
				}

				//n+1 can be tokenized as n1
				if (reader.currToken === NUMBER) {
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

			reader.skip(CLOSE_PARENTHESIS) || reader.error();

			return element;
		}
	}

	toString () {
		return ':' + this.getNameWithVendor() + '(' + this.join(', ') + ')';
	}

	toCode (code) {
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
