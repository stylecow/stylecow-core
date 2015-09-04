"use strict";

const COLON = Symbol.for('COLON');
const NAME  = Symbol.for('NAME');

var stylecow = require('../../index');

stylecow.PseudoClass = class extends require('../../classes/node-vendor') {

	constructor() {
		super('PseudoClass');
	}

	static create (reader) {
		if (reader.currToken[0] === COLON && reader.nextToken[0] === NAME) {
			reader.move();

			return (new stylecow.PseudoClass())
				.setSource(reader)
				.setNameWithVendor(reader.getAndMove()[3]);
		}
	}

	toString () {
		return ':' + this.getNameWithVendor();
	}

	toCode (code) {
		code.append(this.toString(), this);
	}
}