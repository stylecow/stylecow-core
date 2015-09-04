"use strict";

const SEMICOLON = Symbol.for('SEMICOLON');
const NAME      = Symbol.for('NAME');
const COMMA     = Symbol.for('COMMA');

var stylecow = require('../../index');

stylecow.Selectors = class extends require('../../classes/node-collection') {

	constructor(reader) {
		super(reader, 'Selectors');
	}

	static create (reader) {
		var element = new stylecow.Selectors(reader);

		do {
			if (reader.currToken === SEMICOLON) {
				break;
			}
			
			element.push(stylecow.Selector.create(reader) || reader.error());
		} while (reader.currToken === COMMA && reader.move());

		return element;
	}

	static createKeyframeSelectors (reader) {
		var element = new stylecow.Selectors(reader);

		do {
			if (reader.currToken === NAME && (reader.currStr === 'from' || reader.currStr === 'to')) {
				element.push(stylecow.Keyword.create(reader) || reader.error());
			} else {
				element.push(stylecow.Unit.create(reader)
					 || stylecow.Number.create(reader)
					 || reader.error());
			}
		} while (reader.currToken === COMMA && reader.move());

		return element;
	}

	toString () {
		return this.join(', ');
	}

	toCode (code) {
		var latest = this.length - 1;

		this.forEach(function (child, k) {
			child.toCode(code);

			if (k !== latest) {
				code.appendStyle('selector-comma-before');
				code.append(',');
				code.appendStyle('selector-comma-after');
			}
		});
	}
}
