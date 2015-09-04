"use strict";

const ASTERISK = Symbol.for('ASTERISK');

var stylecow = require('../../index');

stylecow.UniversalSelector = class extends require('../../classes/node') {

	constructor() {
		super('UniversalSelector');
	}

	static create (reader) {
		if (reader.currToken[0] === ASTERISK) {
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
