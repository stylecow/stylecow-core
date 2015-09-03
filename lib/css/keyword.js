"use strict";

var stylecow = require('../index');

stylecow.Keyword = class extends require('../classes/node-vendor') {

	constructor() {
		super('Keyword');
	}

	static create (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.NAME) {
			return (new stylecow.Keyword())
				.setSource(reader)
				.setNameWithVendor(reader.getAndMove()[3]);
		}
	}

	toString () {
		return this.getNameWithVendor();
	}

	toCode (code) {
		code.append(this.toString(), this);
	}
}