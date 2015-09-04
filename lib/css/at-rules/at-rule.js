"use strict";

const AT                 = Symbol.for('AT');
const NAME               = Symbol.for('NAME');
const OPEN_CURLY_BRACKET = Symbol.for('OPEN_CURLY_BRACKET');

var stylecow = require('../../index');

stylecow.AtRule = class extends require('../../classes/node-collection-vendor') {

	constructor() {
		super('AtRule');
	}

	static create (reader) {

		if (reader.currToken === AT && reader.nextToken === NAME) {
			reader.move();

			var element = (new stylecow.AtRule())
				.setSource(reader)
				.setNameWithVendor(reader.getStringAndMove());

			/*
			 * at-rules with a keyword:
			 *
			 * @counter-style
			 * @font-feature-values
			 */
			if (element.name === 'counter-style' || element.name === 'font-feature-values') {
				element.push(stylecow.Keyword.create(reader) || reader.error());
			}

			/*
			 * at-rules with selectors:
			 *
			 * @page
			 */
			else if (element.name === 'page' && reader.currToken !== OPEN_CURLY_BRACKET) {
				element.push(stylecow.Selectors.create(reader) || reader.error());
			}

			element.push(stylecow.Block.create(reader) || reader.error());

			return element;
		}
	}

	toString () {
		return '@' + this.getNameWithVendor() + ' ' + this.join(' ');
	}

	toCode (code) {
		code.appendStyle('at-rule-block-before');
		code.append('@' + this.getNameWithVendor() + ' ', this);

		this.forEach(function (child, k) {
			child.toCode(code);
		});
		code.appendStyle('at-rule-block-after');
	}
}
