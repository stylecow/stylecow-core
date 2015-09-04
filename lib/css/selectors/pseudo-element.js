"use strict";

const COLON = Symbol.for('COLON');
const NAME  = Symbol.for('NAME');

var stylecow = require('../../index');

stylecow.PseudoElement = class extends require('../../classes/node-vendor') {

	constructor(reader) {
		super(reader, 'PseudoElement');
	}

	static create (reader) {
		if (reader.currToken === COLON && reader.nextToken === COLON && reader.nextNextToken === NAME) {
			reader.move();
			reader.move();

			return (new stylecow.PseudoElement(reader)).setNameWithVendor(reader.getStringAndMove());
		}
	}

	toString () {
		return '::' + this.getNameWithVendor();
	}

	toCode (code) {
		code.append(this.toString(), this);
	}
}
