"use strict";

const COLON = Symbol.for('COLON');
const NAME  = Symbol.for('NAME');

var stylecow = require('../../index');

stylecow.PseudoClass = class extends require('../../classes/node-vendor') {

	constructor(reader) {
		super(reader, 'PseudoClass');
	}

	static create (reader) {
		if (reader.currToken === COLON && reader.nextToken === NAME) {
			reader.move();

			return (new stylecow.PseudoClass(reader)).setNameWithVendor(reader.getStringAndMove());
		}
	}

	toString () {
		return ':' + this.getNameWithVendor();
	}

	toCode (code) {
		code.append(this.toString(), this);
	}
}