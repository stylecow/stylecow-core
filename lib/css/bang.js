"use strict";

const EXCLAMATION = Symbol.for('EXCLAMATION');
const NAME        = Symbol.for('NAME');
const COMMENT     = Symbol.for('COMMENT');

var stylecow = require('../index');

stylecow.Bang = class extends require('../classes/node-name') {

	constructor(reader) {
		super(reader, 'Bang');
	}

	static create (reader) {
		if (reader.currToken === EXCLAMATION) {
			reader.move();

			reader.skipAll(COMMENT);

			if (reader.currToken !== NAME) {
				reader.error();
			}

			return (new stylecow.Bang(reader)).setName(reader.getStringAndMove());
		}
	}

	toString () {
		return '!' + this.name;
	}

	toCode (code) {
		code.append(this.toString(), this);
	}
}
