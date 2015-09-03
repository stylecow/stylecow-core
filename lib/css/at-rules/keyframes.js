"use strict";

var stylecow = require('../../index');

stylecow.Keyframes = class extends require('../../classes/node-collection-vendor') {

	constructor() {
		super('AtRule', 'Keyframes');
	}

	static create (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.AT && reader.nextToken[0] === t.NAME && reader.nextToken[3].match(/^(-(\w+)-)?keyframes$/)) {
			reader.move();

			var element = (new stylecow.Keyframes())
				.setSource(reader)
				.setNameWithVendor(reader.getAndMove()[3]);

			element.push(stylecow.Keyword.create(reader) || reader.error());
			element.push(stylecow.Block.createKeyframesBlock(reader) || reader.error());

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
