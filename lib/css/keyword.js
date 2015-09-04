"use strict";

const NAME = Symbol.for('NAME');

var stylecow = require('../index');

stylecow.Keyword = class extends require('../classes/node-vendor') {

	constructor() {
		super('Keyword');
	}

	static create (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken === NAME) {
			return (new stylecow.Keyword())
				.setSource(reader)
				.setNameWithVendor(reader.getStringAndMove());
		}
	}

	toString () {
		return this.getNameWithVendor();
	}

	toCode (code) {
		code.append(this.toString(), this);
	}
}