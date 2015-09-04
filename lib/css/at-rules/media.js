"use strict";

const AT        = Symbol.for('AT');
const NAME      = Symbol.for('NAME');

var stylecow = require('../../index');

stylecow.Media = class extends require('../../classes/node-collection-name') {

	constructor(reader) {
		super(reader, 'AtRule', 'Media');
		this.name = 'media';
	}

	static create (reader) {
		if (reader.currToken === AT && reader.nextToken === NAME && reader.nextStr === 'media') {
			var element = new stylecow.Media(reader);
			reader.move();
			reader.move();

			element.push(stylecow.MediaQueries.create(reader) || reader.error());
			element.push(stylecow.Block.create(reader) || reader.error());

			return element;
		}
	}

	toString () {
		return '@' + this.name + ' ' + this.join(' ');
	}

	toCode (code) {
		code.appendStyle('at-rule-block-before');
		code.append('@' + this.name + ' ', this);

		this.forEach(function (child, k) {
			child.toCode(code);
		});
		code.appendStyle('at-rule-block-after');
	}
}
