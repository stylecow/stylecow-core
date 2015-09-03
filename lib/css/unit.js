"use strict";

var stylecow = require('../index');

stylecow.Unit = class extends require('../classes/node-collection-name') {

	constructor() {
		super('Unit');
	}

	static create (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.NUMBER) {
			if (reader.nextToken[0] === t.NAME) {
				var element = (new stylecow.Unit()).setName(reader.nextToken[3]);
			} else if (reader.nextToken[0] === t.PERCENTAGE) {
				var element = (new stylecow.Unit()).setName('%');
			} else {
				return;
			}

			element
				.setSource(reader)
				.push(stylecow.Number.create(reader) || reader.error());

			reader.move();

			return element;
		}
	}

	toString () {
		return this.join('') + this.name;
	}

	toCode (code) {
		this.forEach(function (child) {
			child.toCode(code);
		});

		code.append(this.name);
	}
}
