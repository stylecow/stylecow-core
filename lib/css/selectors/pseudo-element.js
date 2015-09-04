"use strict";

const COLON = Symbol.for('COLON');
const NAME  = Symbol.for('NAME');

var stylecow = require('../../index');

stylecow.PseudoElement = class extends require('../../classes/node-vendor') {

	constructor() {
		super('PseudoElement');
	}

	static create (reader) {
		if (reader.currToken[0] === COLON && reader.nextToken[0] === COLON && reader.get(1)[0] === NAME) {
			reader.move();
			reader.move();

			return (new stylecow.PseudoElement())
				.setSource(reader)
				.setNameWithVendor(reader.getAndMove()[3]);
		}
	}

	toString () {
		return '::' + this.getNameWithVendor();
	}

	toCode (code) {
		code.append(this.toString(), this);
	}
}
