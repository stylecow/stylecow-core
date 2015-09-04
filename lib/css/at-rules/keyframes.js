"use strict";

const AT        = Symbol.for('AT');
const NAME      = Symbol.for('NAME');

var stylecow = require('../../index');

stylecow.Keyframes = class extends require('../../classes/node-collection-vendor') {

	constructor() {
		super('AtRule', 'Keyframes');
	}

	static create (reader) {
		if (reader.currToken === AT && reader.nextToken === NAME && reader.nextStr.match(/^(-(\w+)-)?keyframes$/)) {
			reader.move();

			var element = (new stylecow.Keyframes())
				.setSource(reader)
				.setNameWithVendor(reader.getStringAndMove());

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
