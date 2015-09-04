"use strict";

const HASH = Symbol.for('HASH');

var stylecow = require('../index');

stylecow.Hex = class extends require('../classes/node-name') {

	constructor() {
		super('Hex');
	}

	static create (reader) {
		if (reader.currToken[0] === HASH) {
			if (/^[0-9a-fA-F]+$/.test(reader.currToken[3])) {
				return (new stylecow.Hex())
					.setSource(reader)
					.setName(reader.getAndMove()[3]);
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