"use strict";

var stylecow = require('../../index');

stylecow.IdSelector = class extends require('../../classes/node-name') {

	constructor() {
		super('IdSelector');
	}

	static create (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.HASH) {
			return (new stylecow.IdSelector())
				.setSource(reader)
				.setName(reader.getAndMove()[3]);
		}
	}

	toString () {
		return '#' + this.name;
	}

	toCode (code) {
		code.append(this.toString(), this);
	}
}