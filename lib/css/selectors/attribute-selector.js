"use strict";

var stylecow = require('../../index');

stylecow.AttributeSelector = class extends require('../../classes/node-collection') {

	constructor() {
		super('AttributeSelector');
	}

	static create (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.OPEN_SQUARE_BRACKET) {
			reader.move();

			var element = (new stylecow.AttributeSelector()).setSource(reader);

			//Attribute name
			element.push(stylecow.Keyword.create(reader) || reader.error());

			//Match combinator
			if (reader.currToken[0] !== t.CLOSE_SQUARE_BRACKET) {
				element.push(stylecow.Comparator.createMatch(reader) || reader.error());

				if (reader.currToken[0] === t.NAME) {
					element.push((new stylecow.String())
						.setSource(reader)
						.setName(reader.getAndMove()[3]) || reader.error());
				} else {
					element.push(stylecow.String.create(reader) || reader.error());
				}
			}

			reader.skip(t.CLOSE_SQUARE_BRACKET) || reader.error();
		
			return element;
		}
	}

	toString () {
		return '[' + this.join('') + ']';
	}

	toCode (code) {
		code.append('[');
		this.forEach(function (child, k) {
			child.toCode(code);
		});
		code.append(']');
	}
}
