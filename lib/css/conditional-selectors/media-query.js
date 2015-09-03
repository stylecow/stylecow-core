"use strict";

var stylecow = require('../../index');

stylecow.MediaQuery = class extends require('../../classes/node-collection') {

	constructor() {
		super('MediaQuery');
	}

	static create (reader) {
		var t = stylecow.Tokens;
		var element = (new stylecow.MediaQuery()).setSource(reader);

		// not|only operators
		if (reader.currToken[0] === t.NAME && (reader.currToken[3].toLowerCase() === 'only' || reader.currToken[3].toLowerCase() === 'not')) {
			element.push(stylecow.Keyword.create(reader) || reader.error());
		}

		//media type
		if (reader.currToken[0] === t.NAME) {
			element.push(stylecow.Keyword.create(reader) || reader.error());

			if (reader.currToken[0] === t.NAME) {
				if (reader.currToken[3].toLowerCase() === 'and' || reader.currToken[3].toLowerCase() === 'or') {
					element.push(stylecow.Keyword.create(reader) || reader.error());
				} else {
					return reader.error();
				}
			} else {
				return element;
			}
		}

		while (reader.currToken[0] !== t.EOT) {
			element.push(stylecow.ConditionalExpression.create(reader) || reader.error());

			// and|or
			if (reader.currToken[0] === t.NAME && (reader.currToken[3].toLowerCase() === 'and' || reader.currToken[3].toLowerCase() === 'or')) {
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
