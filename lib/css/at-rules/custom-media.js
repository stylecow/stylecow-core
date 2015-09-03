"use strict";

var stylecow = require('../../index');

stylecow.CustomMedia = class extends require('../../classes/node-collection-name') {

	constructor() {
		super('AtRule', 'CustomMedia');
		this.name = 'custom-media';
	}

	static create (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.AT && reader.nextToken[0] === t.NAME && reader.nextToken[3] === 'custom-media') {
			var element = (new stylecow.CustomMedia()).setSource(reader);
			reader.move();
			reader.move();

			element.push(stylecow.ExtensionName.create(reader) || reader.error());
			element.push(stylecow.MediaQueries.create(reader) || reader.error());

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
