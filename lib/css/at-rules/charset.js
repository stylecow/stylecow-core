"use strict";

const AT        = Symbol.for('AT');
const NAME      = Symbol.for('NAME');
const SEMICOLON = Symbol.for('SEMICOLON');

var stylecow = require('../../index');

stylecow.Charset = class extends require('../../classes/node-collection-name') {

	constructor(data) {
		super(data, 'AtRule');
		this.name = 'charset';
	}

	static create (reader) {
		if (reader.currToken === AT && reader.nextToken === NAME && reader.nextStr === 'charset') {
			var element = new stylecow.Charset(reader.data());
			reader.move();
			reader.move();

			element.push(stylecow.String.create(reader) || reader.error());

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
