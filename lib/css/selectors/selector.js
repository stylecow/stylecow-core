"use strict";

const CLOSE_PARENTHESIS  = Symbol.for('CLOSE_PARENTHESIS');
const OPEN_CURLY_BRACKET = Symbol.for('OPEN_CURLY_BRACKET');
const SEMICOLON          = Symbol.for('SEMICOLON');
const COMMA              = Symbol.for('COMMA');
const EOF                = Symbol.for('EOF');

var stylecow = require('../../index');

stylecow.Selector = class extends require('../../classes/node-collection') {

	constructor(reader) {
		super(reader, 'Selector');
	}

	static create (reader) {
		var element = new stylecow.Selector(reader);

		//Start by a combinator?
		var child = stylecow.Combinator.create(reader);

		if (child) {
			element.push(child);
		}

		do {
			if (reader.currToken === CLOSE_PARENTHESIS || reader.currToken === OPEN_CURLY_BRACKET || reader.currToken === SEMICOLON) {
				break;
			}

			element.push(stylecow.ExtensionName.create(reader)
				|| stylecow.ExtensionName.createFromCustomSelector(reader)
				|| stylecow.TypeSelector.create(reader)
				|| stylecow.Comment.create(reader)
				|| stylecow.AttributeSelector.create(reader)
				|| stylecow.UniversalSelector.create(reader)
				|| stylecow.ClassSelector.create(reader)
				|| stylecow.IdSelector.create(reader)
				|| stylecow.PseudoClassFunction.createSelectors(reader)
				|| stylecow.PseudoClassFunction.createPosition(reader)
				|| stylecow.PseudoClass.create(reader)
				|| stylecow.PseudoElement.create(reader)
				|| stylecow.PlaceholderSelector.create(reader)
				|| stylecow.Combinator.createJoinCombinator(reader)
				|| reader.error()
			);

			child = stylecow.Combinator.create(reader);

			if (child) {
				element.push(child);
			}
		} while (reader.currToken !== COMMA && reader.currToken !== EOF);

		if (!element.length) {
			reader.error();
		}

		//Remove the first and last combinators if it's a space
		if (element.length && element[0].type === 'Combinator' && element[0].name === ' ') {
			element.shift();
		}

		if (element.length && element[element.length - 1].type === 'Combinator' && element[element.length - 1].name === ' ') {
			element.pop();
		}

		return element;
	}

	toString () {
		return this.join('');
	}

	toCode (code) {
		this.forEach(function (child) {
			child.toCode(code);
		});
	}
}
