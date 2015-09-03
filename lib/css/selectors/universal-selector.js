"use strict";

var stylecow = require('../../index');

stylecow.UniversalSelector = class extends require('../../classes/node') {

	constructor() {
		super('UniversalSelector');
	}

	static create (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.ASTERISK) {
			reader.move();

			return (new stylecow.UniversalSelector()).setSource(reader);
		}
	}

	toString () {
		return '*';
	}

	toCode (code) {
		code.append(this.toString(), this);
	}
}
