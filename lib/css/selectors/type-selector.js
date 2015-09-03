"use strict";

var stylecow = require('../../index');

stylecow.TypeSelector = class extends require('../../classes/node-name') {

	constructor() {
		super('TypeSelector');
	}

	static create (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.NAME) {
			return (new stylecow.TypeSelector())
				.setSource(reader)
				.setName(reader.getAndMove()[3]);
		}
	}

	toString () {
		return this.name;
	}

	toCode (code) {
		code.append(this.toString(), this);
	}
}
