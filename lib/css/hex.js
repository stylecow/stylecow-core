"use strict";

const HASH = Symbol.for('HASH');

var stylecow = require('../index');

stylecow.Hex = class extends require('../classes/node-name') {

	constructor(data) {
		super(data, 'Hex');
	}

	static create (reader) {
		if (reader.currToken === HASH) {
			if (/^[0-9a-fA-F]+$/.test(reader.currStr)) {
				return (new stylecow.Hex(reader.data())).setName(reader.getStringAndMove());
			}

			reader.error();
		}
	}

	toString () {
		return '#' + this.name;
	}

	toCode (code) {
		code.append(this.toString(), this);
	}
}