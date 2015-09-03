"use strict";

var stylecow = require('../../index');

stylecow.ClassSelector = class extends require('../../classes/node-name') {

	constructor() {
		super('ClassSelector');
	}

	static create (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.STOP && reader.nextToken[0] === t.NAME) {
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
