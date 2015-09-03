"use strict";

var stylecow = require('../../index');

stylecow.AtRule = class extends require('../../classes/node-collection-vendor') {

	constructor() {
		super('AtRule');
	}

	static create (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.AT && reader.nextToken[0] === t.NAME) {
			reader.move();

			var element = (new stylecow.AtRule())
				.setSource(reader)
				.setNameWithVendor(reader.getAndMove()[3]);

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
			else if (element.name === 'page' && reader.currToken[0] !== t.OPEN_CURLY_BRACKET) {
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
