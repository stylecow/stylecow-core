"use strict";

const PLUS     = Symbol.for('PLUS');
const MINUS    = Symbol.for('MINUS');
const ASTERISK = Symbol.for('ASTERISK');
const SOLIDUS  = Symbol.for('SOLIDUS');

var stylecow = require('../index');

stylecow.Operator = class extends require('../classes/node-name') {

	constructor(data) {
		super(data, 'Operator');
	}

	static create (reader) {
		if (reader.currToken === PLUS) {
			reader.move();
			return (new stylecow.Operator(reader.data())).setName('+');
		}

		if (reader.currToken === MINUS) {
			reader.move();
			return (new stylecow.Operator(reader.data())).setName('-');
		}

		if (reader.currToken === ASTERISK) {
			reader.move();
			return (new stylecow.Operator(reader.data())).setName('*');
		}

		if (reader.currToken === SOLIDUS) {
			reader.move();
			return (new stylecow.Operator(reader.data())).setName('/');
		}
	}

	toString () {
		return this.name;
	}

	toCode (code) {
		code.append(this.toString());
	}
}
