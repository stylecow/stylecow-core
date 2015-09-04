"use strict";

const STOP = Symbol.for('STOP');
const NAME = Symbol.for('NAME');

var stylecow = require('../../index');

stylecow.ClassSelector = class extends require('../../classes/node-name') {

	constructor() {
		super('ClassSelector');
	}

	static create (reader) {
		if (reader.currToken === STOP && reader.nextToken === NAME) {
			reader.move();

			return (new stylecow.ClassSelector())
				.setSource(reader)
				.setName(reader.getStringAndMove());
		}
	}

	toString () {
		return '.' + this.name;
	}

	toCode (code) {
		code.append(this.toString(), this);
	}
}
