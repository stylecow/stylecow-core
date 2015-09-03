"use strict";

var stylecow = require('../../index');

stylecow.ConditionalFeature = class extends require('../../classes/node-collection-vendor') {

	constructor() {
		super('ConditionalFeature');
	}

	static create (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.NAME && reader.getNextToken()[0] === t.COLON) {
			var element = (new stylecow.ConditionalFeature())
				.setSource(reader)
				.setNameWithVendor(reader.getAndMove()[3]);

			reader.move();

			do {
				element.push(stylecow.Value.create(reader) || reader.error());
			} while (reader.currToken[0] === t.COMMA && reader.move());

			return element;
		}
	}

	toString () {
		return this.getNameWithVendor() + ': ' + this.join(' ');
	}

	toCode (code) {
		code.append(this.getNameWithVendor(), this);

		code.appendStyle('declaration-colon-before');
		code.append(':');
		code.appendStyle('declaration-colon-after');

		var latest = this.length - 1;

		this.forEach(function (child, k) {
			child.toCode(code);

			if (k !== latest) {
				code.append(' ');
			}
		});
	}
}
