"use strict";

const AT        = Symbol.for('AT');
const NAME      = Symbol.for('NAME');
const SEMICOLON = Symbol.for('SEMICOLON');

var stylecow = require('../../index');

stylecow.Charset = class extends require('../../classes/node-collection-name') {

	constructor() {
		super('AtRule', 'Charset');
		this.name = 'charset';
	}

	static create (reader) {
		if (reader.currToken[0] === AT && reader.nextToken[0] === NAME && reader.nextToken[3] === 'charset') {
			var element = (new stylecow.Charset()).setSource(reader);
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
