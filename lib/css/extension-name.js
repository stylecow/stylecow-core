"use strict";

const COLON = Symbol.for('COLON');
const NAME  = Symbol.for('NAME');

var stylecow = require('../index');

stylecow.ExtensionName = class extends require('../classes/node-name') {

	constructor() {
		super('ExtensionName');
	}

	static create (reader) {
		if (reader.currToken[0] === NAME && reader.currToken[3].substr(0, 2) === '--') {
			return (new stylecow.ExtensionName())
				.setSource(reader)
				.setName(reader.getAndMove()[3].substr(2));
		}
	}

	static createFromCustomSelector (reader) {
		if (reader.currToken[0] === COLON && reader.nextToken[0] === NAME && reader.nextToken[3].substr(0, 2) === '--') {
			reader.move();

			return stylecow.ExtensionName.create(reader);
		}
	}

	toString () {
		return '--' +this.name;
	}

	toCode (code) {
		code.append(this.toString(), this);
	}
}