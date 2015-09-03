"use strict";

var stylecow = require('../../index');

stylecow.CustomSelector = class extends require('../../classes/node-collection-name') {

	constructor() {
		super('AtRule', 'CustomSelector');
		this.name = 'custom-selector';
	}

	static create (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.AT && reader.nextToken[0] === t.NAME && reader.nextToken[3] === 'custom-selector') {
			var element = (new stylecow.CustomSelector()).setSource(reader);
			reader.move();
			reader.move();

			element.push(
					stylecow.ExtensionName.create(reader)
				 || stylecow.ExtensionName.createFromCustomSelector(reader)
				 || reader.error()
			);
			element.push(stylecow.Selectors.create(reader) || reader.error());

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
