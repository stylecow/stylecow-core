"use strict";

var stylecow = require('../../index');

stylecow.PlaceholderSelector = class extends require('../../classes/node-name') {

	constructor() {
		super('PlaceholderSelector');
	}

	static create (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.PERCENTAGE && reader.nextToken[0] === t.NAME) {
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
