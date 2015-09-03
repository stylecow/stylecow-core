"use strict";

var stylecow = require('../index');

stylecow.ExtensionName = class extends require('../classes/node-name') {

	constructor() {
		super('ExtensionName');
	}

	static create (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.NAME && reader.currToken[3].substr(0, 2) === '--') {
			return (new stylecow.ExtensionName())
				.setSource(reader)
				.setName(reader.getAndMove()[3].substr(2));
		}
	}

	static createFromCustomSelector (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.COLON && reader.nextToken[0] === t.NAME && reader.nextToken[3].substr(0, 2) === '--') {
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