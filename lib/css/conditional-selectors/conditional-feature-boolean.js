"use strict";

const CLOSE_PARENTHESIS = Symbol.for('CLOSE_PARENTHESIS');
const NAME              = Symbol.for('NAME');
const WHITESPACE        = Symbol.for('WHITESPACE');

var stylecow = require('../../index');

stylecow.ConditionalFeatureBoolean = class extends require('../../classes/node-name') {

	constructor(reader) {
		super(reader, 'ConditionalFeatureBoolean');
	}

	static create (reader) {
		if (reader.currToken === NAME && (reader.nextToken === CLOSE_PARENTHESIS || (reader.nextToken === WHITESPACE && reader.nextNextToken === CLOSE_PARENTHESIS))) {
			return (new stylecow.ConditionalFeatureBoolean(reader)).setName(reader.getStringAndMove());
		}
	}

	toString () {
		return this.name;
	}

	toCode (code) {
		code.append(this.toString(), this);
	}
}
