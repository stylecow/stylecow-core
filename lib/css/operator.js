"use strict";

const PLUS     = Symbol.for('PLUS');
const MINUS    = Symbol.for('MINUS');
const ASTERISK = Symbol.for('ASTERISK');
const SOLIDUS  = Symbol.for('SOLIDUS');

var stylecow = require('../index');

stylecow.Operator = class extends require('../classes/node-name') {

	constructor() {
		super('Operator');
	}

	static create (reader) {
		if (reader.currToken[0] === PLUS) {
			reader.move();
			return (new stylecow.Operator)
				.setSource(reader)
				.setName('+');
		}

		if (reader.currToken[0] === MINUS) {
			reader.move();
			return (new stylecow.Operator)
				.setSource(reader)
				.setName('-');
		}

		if (reader.currToken[0] === ASTERISK) {
			reader.move();
			return (new stylecow.Operator)
				.setSource(reader)
				.setName('*');
		}

		if (reader.currToken[0] === SOLIDUS) {
			reader.move();
			return (new stylecow.Operator)
				.setSource(reader)
				.setName('/');
		}
	}

	toString () {
		return this.name;
	}

	toCode (code) {
		code.append(this.toString());
	}
}
