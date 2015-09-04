"use strict";

const OPEN_SQUARE_BRACKET  = Symbol.for('OPEN_SQUARE_BRACKET');
const CLOSE_SQUARE_BRACKET = Symbol.for('CLOSE_SQUARE_BRACKET');
const NAME              = Symbol.for('NAME');

var stylecow = require('../../index');

stylecow.AttributeSelector = class extends require('../../classes/node-collection') {

	constructor() {
		super('AttributeSelector');
	}

	static create (reader) {
		if (reader.currToken[0] === OPEN_SQUARE_BRACKET) {
			reader.move();

			var element = (new stylecow.AttributeSelector()).setSource(reader);

			//Attribute name
			element.push(stylecow.Keyword.create(reader) || reader.error());

			//Match combinator
			if (reader.currToken[0] !== CLOSE_SQUARE_BRACKET) {
				element.push(stylecow.Comparator.createMatch(reader) || reader.error());

				if (reader.currToken[0] === NAME) {
					element.push((new stylecow.String())
						.setSource(reader)
						.setName(reader.getAndMove()[3]) || reader.error());
				} else {
					element.push(stylecow.String.create(reader) || reader.error());
				}
			}

			reader.skip(CLOSE_SQUARE_BRACKET) || reader.error();
		
			return element;
		}
	}

	toString () {
		return '[' + this.join('') + ']';
	}

	toCode (code) {
		code.append('[');
		this.forEach(function (child, k) {
			child.toCode(code);
		});
		code.append(']');
	}
}
