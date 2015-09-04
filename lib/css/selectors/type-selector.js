"use strict";

const NAME  = Symbol.for('NAME');

var stylecow = require('../../index');

stylecow.TypeSelector = class extends require('../../classes/node-name') {

	constructor() {
		super('TypeSelector');
	}

	static create (reader) {
		if (reader.currToken === NAME) {
			return (new stylecow.TypeSelector())
				.setSource(reader)
				.setName(reader.getStringAndMove());
		}
	}

	toString () {
		return this.name;
	}

	toCode (code) {
		code.append(this.toString(), this);
	}
}
