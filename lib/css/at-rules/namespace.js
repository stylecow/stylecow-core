"use strict";

var stylecow = require('../../index');

stylecow.Namespace = class extends require('../../classes/node-collection-name') {

	constructor() {
		super('AtRule', 'Namespace');
		this.name = 'namespace';
	}

	static create (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.AT && reader.nextToken[0] === t.NAME && reader.nextToken[3] === 'namespace') {
			var element = (new stylecow.Namespace()).setSource(reader);
			reader.move();
			reader.move();

			if (reader.currToken[0] === t.NAME) {
				element.push(stylecow.Keyword.create(reader) || reader.error());
			}

			element.push(stylecow.Function.createUrl(reader, true) || reader.error());

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
