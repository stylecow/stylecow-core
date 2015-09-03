"use strict";

var stylecow = require('../../index');

stylecow.Extend = class extends require('../../classes/node-collection-name') {

	constructor() {
		super('AtRule', 'Extend');
		this.name = 'extend';
	}

	static create (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.AT && reader.nextToken[0] === t.NAME && reader.nextToken[3] === 'extend') {
			var element = (new stylecow.Extend()).setSource(reader);
			reader.move();
			reader.move();

			element.push(stylecow.Selector.create(reader));

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
