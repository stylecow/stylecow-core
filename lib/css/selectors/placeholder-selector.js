"use strict";

const PERCENTAGE = Symbol.for('PERCENTAGE');
const NAME       = Symbol.for('NAME');

var stylecow = require('../../index');

stylecow.PlaceholderSelector = class extends require('../../classes/node-name') {

	constructor() {
		super('PlaceholderSelector');
	}

	static create (reader) {
		if (reader.currToken[0] === PERCENTAGE && reader.nextToken[0] === NAME) {
			reader.move();

			return (new stylecow.PlaceholderSelector())
				.setSource(reader)
				.setName(reader.getAndMove()[3]);
		}
	}

	toString () {
		return '%' + this.name;
	}

	toCode (code) {
		code.append(this.toString(), this);
	}
}
