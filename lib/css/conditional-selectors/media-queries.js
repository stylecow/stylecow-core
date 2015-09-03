"use strict";

var stylecow = require('../../index');

stylecow.MediaQueries = class extends require('../../classes/node-collection') {

	constructor() {
		super('MediaQueries');
	}

	static create (reader) {
		var t = stylecow.Tokens;
		var element = (new stylecow.MediaQueries()).setSource(reader);

		do {
			element.push(stylecow.MediaQuery.create(reader) || reader.error());
		} while (reader.currToken[0] === t.COMMA && reader.move());

		return element;
	}

	toString () {
		return this.join(', ');
	}

	toCode (code) {
		var latest = this.length - 1;

		this.forEach(function (child, k) {
			child.toCode(code);

			if (k !== latest) {
				code.appendStyle('selector-comma-before');
				code.append(',');
				code.appendStyle('selector-comma-after');
			}
		});
	}
}
