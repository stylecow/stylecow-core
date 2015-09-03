"use strict";

var stylecow = require('../index');

stylecow.Bang = class extends require('../classes/node-name') {

	constructor() {
		super('Bang');
	}

	static create (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.EXCLAMATION) {
			reader.move();

			reader.skipAll(t.COMMENT);

			if (reader.currToken[0] !== t.NAME) {
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
