"use strict";

const CLOSE_PARENTHESIS = Symbol.for('CLOSE_PARENTHESIS');
const NAME              = Symbol.for('NAME');

var stylecow = require('../../index');

stylecow.ConditionalFeatureBoolean = class extends require('../../classes/node-name') {

	constructor() {
		super('ConditionalFeatureBoolean');
	}

	static create (reader) {
		if (reader.currToken === NAME && reader.getNextToken()[0] === CLOSE_PARENTHESIS) {
			return (new stylecow.ConditionalFeatureBoolean())
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
