"use strict";

var stylecow = require('../../index');

stylecow.ConditionalFeatureBoolean = class extends require('../../classes/node-name') {

	constructor() {
		super('ConditionalFeatureBoolean');
	}

	static create (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.NAME && reader.getNextToken()[0] === t.CLOSE_PARENTHESIS) {
			return (new stylecow.ConditionalFeatureBoolean())
				.setSource(reader)
				.setName(reader.getAndMove()[3]);
		}
	}

	toString () {
		return this.name;
	}

	toCode (code) {
		code.append(this.toString(), this);
	}
}
