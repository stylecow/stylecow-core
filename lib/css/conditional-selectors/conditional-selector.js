"use strict";

const NAME = Symbol.for('NAME');
const EOF  = Symbol.for('EOF');

var stylecow = require('../../index');

stylecow.ConditionalSelector = class extends require('../../classes/node-collection') {

	constructor() {
		super('ConditionalSelector');
	}

	static create (reader) {
		var element = (new stylecow.ConditionalSelector()).setSource(reader);

		// not|only operators
		if (reader.currToken[0] === NAME && (reader.currToken[3].toLowerCase() === 'only' || reader.currToken[3].toLowerCase() === 'not')) {
			element.push(stylecow.Keyword.create(reader) || reader.error());
		}

		while (reader.currToken[0] !== EOF) {
			element.push(stylecow.ConditionalExpression.create(reader) || reader.error());

			// and|or
			if (reader.currToken[0] === NAME && (reader.currToken[3].toLowerCase() === 'and' || reader.currToken[3].toLowerCase() === 'or')) {
				element.push(stylecow.Keyword.create(reader) || reader.error());
			} else {
				break;
			}
		}

		return element;
	}

	toString () {
		return this.join(' ');
	}

	toCode (code) {
		var latest = this.length - 1;

		this.forEach(function (child, k) {
			child.toCode(code);

			if (k !== latest) {
				code.append(' ');
			}
		});
	}
}
