"use strict";

var stylecow = require('../../index');

stylecow.Selectors = class extends require('../../classes/node-collection') {

	constructor() {
		super('Selectors');
	}

	static create (reader) {
		var t = stylecow.Tokens;
		var element = (new stylecow.Selectors()).setSource(reader);

		do {
			if (reader.currToken[0] === t.SEMICOLON) {
				break;
			}
			
			element.push(stylecow.Selector.create(reader) || reader.error());
		} while (reader.currToken[0] === t.COMMA && reader.move());

		return element;
	}

	static createKeyframeSelectors (reader) {
		var t = stylecow.Tokens;
		var element = (new stylecow.Selectors()).setSource(reader);

		do {
			if (reader.currToken[0] === t.NAME && (reader.currToken[3] === 'from' || reader.currToken[3] === 'to')) {
				element.push(stylecow.Keyword.create(reader) || reader.error());
			} else {
				element.push(stylecow.Unit.create(reader)
					 || stylecow.Number.create(reader)
					 || reader.error());
			}
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
