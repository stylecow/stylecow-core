"use strict";

var stylecow = require('../index');

stylecow.Operator = class extends require('../classes/node-name') {

	constructor() {
		super('Operator');
	}

	static create (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.PLUS) {
			reader.move();
			return (new stylecow.Operator)
				.setSource(reader)
				.setName('+');
		}

		if (reader.currToken[0] === t.MINUS) {
			reader.move();
			return (new stylecow.Operator)
				.setSource(reader)
				.setName('-');
		}

		if (reader.currToken[0] === t.ASTERISK) {
			reader.move();
			return (new stylecow.Operator)
				.setSource(reader)
				.setName('*');
		}

		if (reader.currToken[0] === t.SOLIDUS) {
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
