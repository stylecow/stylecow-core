"use strict";

const NAME       = Symbol.for('NAME');
const COLON      = Symbol.for('COLON');
const COMMA      = Symbol.for('COMMA');
const WHITESPACE = Symbol.for('WHITESPACE');

var stylecow = require('../../index');

stylecow.ConditionalFeature = class extends require('../../classes/node-collection-vendor') {

	constructor(reader) {
		super(reader, 'ConditionalFeature');
	}

	static create (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken === NAME && (reader.nextToken === COLON || (reader.nextToken === WHITESPACE && reader.nextNextToken === COLON))) {
			var element = (new stylecow.ConditionalFeature(reader))
				.setNameWithVendor(reader.getStringAndMove());

			reader.move();

			do {
				element.push(stylecow.Value.create(reader) || reader.error());
			} while (reader.currToken === COMMA && reader.move());

			return element;
		}
	}

	toString () {
		return this.getNameWithVendor() + ': ' + this.join(' ');
	}

	toCode (code) {
		code.append(this.getNameWithVendor(), this);

		code.appendStyle('declaration-colon-before');
		code.append(':');
		code.appendStyle('declaration-colon-after');

		var latest = this.length - 1;

		this.forEach(function (child, k) {
			child.toCode(code);

			if (k !== latest) {
				code.append(' ');
			}
		});
	}
}
