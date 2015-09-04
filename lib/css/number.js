"use strict";

const NUMBER = Symbol.for('NUMBER');

var stylecow = require('../index');

stylecow.Number = class extends require('../classes/node-name') {

	constructor() {
		super('Number');
	}

	static create (reader) {
		if (reader.currToken[0] === NUMBER) {
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
