"use strict";

var stylecow = require('../index');

stylecow.Number = class extends require('../classes/node-name') {

	constructor() {
		super('Number');
	}

	static create (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.NUMBER) {
			return (new stylecow.Number)
				.setSource(reader)
				.setName(reader.getAndMove()[3]);
		}
	};

	toString () {
		return '' + this.name;
	}

	toCode (code) {
		var num = this.toString();

		if (!code.style['number-leading-zero']) {
			if (num.indexOf('0.') === 0) {
				num = num.substr(1);
			} else if (num.indexOf('-0.') === 0) {
				num = '-' + num.substr(2);
			}
		}

		code.append(num, this);
	}
}
