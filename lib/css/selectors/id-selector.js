"use strict";

const HASH = Symbol.for('HASH');

var stylecow = require('../../index');

stylecow.IdSelector = class extends require('../../classes/node-name') {

	constructor(reader) {
		super(reader, 'IdSelector');
	}

	static create (reader) {
		if (reader.currToken === HASH) {
			return (new stylecow.IdSelector(reader)).setName(reader.getStringAndMove());
		}
	}

	toString () {
		return '#' + this.name;
	}

	toCode (code) {
		code.append(this.toString(), this);
	}
}