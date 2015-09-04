"use strict";

const CLOSE_PARENTHESIS = Symbol.for('CLOSE_PARENTHESIS');
const EOF               = Symbol.for('EOF');

var stylecow = require('../../index');

stylecow.ConditionalFeatureRange = class extends require('../../classes/node-collection') {

	constructor() {
		super('ConditionalFeatureRange');
	}

	static create (reader) {
		var element = (new stylecow.ConditionalFeatureRange())
			.setSource(reader);

		do {
			element.push(
					stylecow.Keyword.create(reader)
				 || stylecow.Unit.create(reader)
				 || stylecow.Comparator.createRange(reader)
				 || reader.error()
			);
		} while (reader.currToken[0] !== CLOSE_PARENTHESIS && reader.currToken[0] !== EOF);

		return element;
	}

	toString () {
		return this.join(' ');
	}

	toCode (code) {
		this.forEach(function (child) {
			child.toCode(code);
		});
	}
}
