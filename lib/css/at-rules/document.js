"use strict";

const AT      = Symbol.for('AT');
const NAME    = Symbol.for('NAME');
const COMMENT = Symbol.for('COMMENT');
const COMMA   = Symbol.for('COMMA');

var stylecow = require('../../index');

stylecow.Document = class extends require('../../classes/node-collection-vendor') {

	constructor(data) {
		super(data, 'Document');
	}

	static create (reader) {
		if (reader.currToken === AT && reader.nextToken === NAME && reader.nextStr.match(/^(-(\w+)-)?document$/)) {
			reader.move();

			var element = (new stylecow.Document(reader.data()))
				.setNameWithVendor(reader.getStringAndMove());

			do {
				reader.skipAll(COMMENT);

				element.push(
						stylecow.Function.createUrl(reader, false, ['url', 'url-prefix', 'domain'])
					 || stylecow.Function.create(reader)
					 || reader.error()
				);

				reader.skipAll(COMMENT);

			} while (reader.currToken === COMMA && reader.move());

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
