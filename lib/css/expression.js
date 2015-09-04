"use strict";

const OPEN_PARENTHESIS  = Symbol.for('OPEN_PARENTHESIS');
const CLOSE_PARENTHESIS = Symbol.for('CLOSE_PARENTHESIS');
const EOF               = Symbol.for('EOF');

var stylecow = require('../index');

stylecow.Expression = class extends require('../classes/node-collection') {

	constructor(data) {
		super(data, 'Expression');
	}

	static create (reader) {
		if (reader.currToken === OPEN_PARENTHESIS) {
			var element = new stylecow.Expression(reader.data());

			reader.move();

			do {
				element.push(stylecow.Unit.create(reader)
					|| stylecow.Number.create(reader)
					|| stylecow.Operator.create(reader)
					|| stylecow.Expression.create(reader)
					|| stylecow.Function.create(reader)
					|| reader.error());

			} while (reader.currToken !== CLOSE_PARENTHESIS && reader.currToken !== EOF);

			reader.skip(CLOSE_PARENTHESIS) || reader.error();

			return element;
		}
	}

	toString () {
		return '(' + this.join(' ') + ')';
	}

	toCode (code) {
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
