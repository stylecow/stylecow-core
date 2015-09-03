"use strict";

var stylecow = require('../../index');

stylecow.Supports = class extends require('../../classes/node-collection-name') {

	constructor() {
		super('Supports');
		this.name = 'supports';
	}

	static create (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.AT && reader.nextToken[0] === t.NAME && reader.nextToken[3] === 'supports') {
			var element = (new stylecow.Supports()).setSource(reader);
			reader.move();
			reader.move();

			element.push(stylecow.ConditionalSelector.create(reader) || reader.error());
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
