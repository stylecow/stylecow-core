"use strict";

var stylecow = require('../../index');

stylecow.Document = class extends require('../../classes/node-collection-vendor') {

	constructor() {
		super('Document');
	}

	static create (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.AT && reader.nextToken[0] === t.NAME && reader.nextToken[3].match(/^(-(\w+)-)?document$/)) {
			reader.move();

			var element = (new stylecow.Document())
				.setSource(reader)
				.setNameWithVendor(reader.getAndMove()[3]);

			do {
				reader.skipAll(t.COMMENT);

				element.push(
						stylecow.Function.createUrl(reader, false, ['url', 'url-prefix', 'domain'])
					 || stylecow.Function.create(reader)
					 || reader.error()
				);

				reader.skipAll(t.COMMENT);

			} while (reader.currToken[0] === t.COMMA && reader.move());

			element.push(stylecow.Block.create(reader) || reader.error());

			return element;
		}
	}

	toString () {
		return '@' + this.getNameWithVendor() + ' ' + this.getChildren('Function').join(', ') + ' ' + this.getChild('Block');
	}

	toCode (code) {
		code.appendStyle('at-rule-block-before');
		code.append('@' + this.getNameWithVendor() + ' ', this);

		var functions = this.getChildren('Function');

		if (functions.length) {
			var latest = functions.length - 1;

			functions.forEach(function (child, k) {
				child.toCode(code);

				if (k !== latest) {
					code.appendStyle('declaration-comma-before');
					code.append(',');
					code.appendStyle('declaration-comma-after');
				}
			});
		}

		this.getChild('Block').toCode(code);

		code.appendStyle('at-rule-block-after');
	}
}
