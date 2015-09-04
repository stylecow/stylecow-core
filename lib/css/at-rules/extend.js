"use strict";

const AT        = Symbol.for('AT');
const NAME      = Symbol.for('NAME');
const SEMICOLON = Symbol.for('SEMICOLON');

var stylecow = require('../../index');

stylecow.Extend = class extends require('../../classes/node-collection-name') {

	constructor(reader) {
		super(reader, 'AtRule', 'Extend');
		this.name = 'extend';
	}

	static create (reader) {
		if (reader.currToken === AT && reader.nextToken === NAME && reader.nextStr === 'extend') {
			var element = new stylecow.Extend(reader);
			reader.move();
			reader.move();

			element.push(stylecow.Selector.create(reader));

			reader.skip(SEMICOLON);

			return element;
		}
	}

	toString () {
		return '@' + this.name + ' ' + this.join(' ') + ';';
	}

	toCode (code) {
		code.appendStyle('at-rule-inline-before');
		code.append('@' + this.name, this);

		this.forEach(function (child, k) {
			code.append(' ');
			child.toCode(code);
		});

		code.append(';');
		code.appendStyle('at-rule-inline-after');
	}
}
