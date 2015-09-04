"use strict";

const NUMBER     = Symbol.for('NUMBER');
const NAME       = Symbol.for('NAME');
const PERCENTAGE = Symbol.for('PERCENTAGE');

var stylecow = require('../index');

stylecow.Unit = class extends require('../classes/node-collection-name') {

	constructor() {
		super('Unit');
	}

	static create (reader) {
		if (reader.currToken === NUMBER) {
			if (reader.nextToken === NAME) {
				var element = (new stylecow.Unit()).setName(reader.nextStr);
			} else if (reader.nextToken === PERCENTAGE) {
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
