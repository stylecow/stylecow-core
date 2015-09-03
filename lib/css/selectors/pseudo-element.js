"use strict";

var stylecow = require('../../index');

stylecow.PseudoElement = class extends require('../../classes/node-vendor') {

	constructor() {
		super('PseudoElement');
	}

	static create (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.COLON && reader.nextToken[0] === t.COLON && reader.get(1)[0] === t.NAME) {
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
