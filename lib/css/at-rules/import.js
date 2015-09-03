"use strict";

var stylecow = require('../../index');

stylecow.Import = class extends require('../../classes/node-collection-name') {

	constructor() {
		super('AtRule', 'Import');
		this.name = 'import';
	}

	static create (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.AT && reader.nextToken[0] === t.NAME && reader.nextToken[3] === 'import') {
			var element = (new stylecow.Import()).setSource(reader);
			reader.move();
			reader.move();

			element.push(stylecow.Function.createUrl(reader, true) || reader.error());

			if (reader.currToken[0] === t.NAME || reader.currToken[0] === t.OPEN_PARENTHESIS) {
				element.push(stylecow.MediaQueries.create(reader) || reader.error());
			}

			reader.skip(t.SEMICOLON);

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
