"use strict";

const ASTERISK = Symbol.for('ASTERISK');

var stylecow = require('../../index');

stylecow.UniversalSelector = class extends require('../../classes/node') {

	constructor(reader) {
		super(reader, 'UniversalSelector');
	}

	static create (reader) {
		if (reader.currToken === ASTERISK) {
			reader.move();

			return new stylecow.UniversalSelector(reader);
		}
	}

	toString () {
		return '*';
	}

	toCode (code) {
		code.append(this.toString(), this);
	}
}
