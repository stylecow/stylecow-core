"use strict";

const EXCLAMATION = Symbol.for('EXCLAMATION');
const NAME        = Symbol.for('NAME');
const COMMENT     = Symbol.for('COMMENT');

var stylecow = require('../index');

stylecow.Bang = class extends require('../classes/node-name') {

	constructor() {
		super('Bang');
	}

	static create (reader) {
		if (reader.currToken[0] === EXCLAMATION) {
			reader.move();

			reader.skipAll(COMMENT);

			if (reader.currToken[0] !== NAME) {
				reader.error();
			}

			return (new stylecow.Bang())
				.setSource(reader)
				.setName(reader.getAndMove()[3]);
		}
	}

	toString () {
		return '!' + this.name;
	}

	toCode (code) {
		code.append(this.toString(), this);
	}
}
