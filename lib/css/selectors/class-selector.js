"use strict";

const STOP = Symbol.for('STOP');
const NAME = Symbol.for('NAME');

var stylecow = require('../../index');

stylecow.ClassSelector = class extends require('../../classes/node-name') {

	constructor() {
		super('ClassSelector');
	}

	static create (reader) {
		if (reader.currToken[0] === STOP && reader.nextToken[0] === NAME) {
			reader.move();

			return (new stylecow.ClassSelector())
				.setSource(reader)
				.setName(reader.getAndMove()[3]);
		}
	}

	toString () {
		return '.' + this.name;
	}

	toCode (code) {
		code.append(this.toString(), this);
	}
}
