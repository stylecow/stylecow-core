"use strict";

var stylecow = require('../../index');

stylecow.PseudoClass = class extends require('../../classes/node-vendor') {

	constructor() {
		super('PseudoClass');
	}

	static create (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.COLON && reader.nextToken[0] === t.NAME) {
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