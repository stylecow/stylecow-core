"use strict";

var stylecow = require('../../index');

stylecow.Media = class extends require('../../classes/node-collection-name') {

	constructor() {
		super('AtRule', 'Media');
		this.name = 'media';
	}

	static create (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.AT && reader.nextToken[0] === t.NAME && reader.nextToken[3] === 'media') {
			var element = (new stylecow.Media()).setSource(reader);
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
