"use strict";

const STRING = Symbol.for('STRING');

var stylecow = require('../index');

stylecow.String = class extends require('../classes/node-name') {

	constructor() {
		super('String');
	}

	static create (reader) {
		if (reader.currToken[0] === STRING) {
			return (new stylecow.String())
				.setSource(reader)
				.setName(reader.getAndMove()[3]);
		}
	}

	toString () {
		return '"' + this.name.replace(/(")/g, '\\$1') + '"';
	}

	toCode (code) {
		var q = code.style['string-quotes'];

		code.append(q + this.name.replace(new RegExp('([' + q + '])', 'g'), '\\$1') + q, this);
	}
}
