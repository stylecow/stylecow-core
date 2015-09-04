"use strict";

const AT               = Symbol.for('AT');
const NAME             = Symbol.for('NAME');
const OPEN_PARENTHESIS = Symbol.for('OPEN_PARENTHESIS');
const SEMICOLON        = Symbol.for('SEMICOLON');

var stylecow = require('../../index');

stylecow.Import = class extends require('../../classes/node-collection-name') {

	constructor() {
		super('AtRule', 'Import');
		this.name = 'import';
	}

	static create (reader) {
		if (reader.currToken[0] === AT && reader.nextToken[0] === NAME && reader.nextToken[3] === 'import') {
			var element = (new stylecow.Import()).setSource(reader);
			reader.move();
			reader.move();

			element.push(stylecow.Function.createUrl(reader, true) || reader.error());

			if (reader.currToken[0] === NAME || reader.currToken[0] === OPEN_PARENTHESIS) {
				element.push(stylecow.MediaQueries.create(reader) || reader.error());
			}

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
