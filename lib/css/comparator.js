"use strict";

const EQUALS        = Symbol.for('EQUALS');
const TILDE         = Symbol.for('TILDE');
const VERTICAL_LINE = Symbol.for('VERTICAL_LINE');
const CARET         = Symbol.for('CARET');
const DOLLAR        = Symbol.for('DOLLAR');
const ASTERISK      = Symbol.for('ASTERISK');
const LESS_THAN     = Symbol.for('LESS_THAN');
const GREATER_THAN  = Symbol.for('GREATER_THAN');

var stylecow = require('../index');

stylecow.Comparator = class extends require('../classes/node-name') {

	constructor() {
		super('Comparator');
	}

	static createMatch (reader) {
		if (reader.currToken[0] === EQUALS) {
			reader.move();

			return (new stylecow.Comparator())
				.setSource(reader)
				.setName('=');
		}

		if (reader.nextToken[0] === EQUALS) {
			if (reader.currToken[0] === TILDE) {
				var element = (new stylecow.Comparator())
					.setSource(reader)
					.setName('~=');

				reader.move();
				reader.move();

				return element;
			}

			if (reader.currToken[0] === VERTICAL_LINE) {
				var element = (new stylecow.Comparator())
					.setSource(reader)
					.setName('|=');

				reader.move();
				reader.move();

				return element;
			}

			if (reader.currToken[0] === CARET) {
				var element = (new stylecow.Comparator())
					.setSource(reader)
					.setName('^=');

				reader.move();
				reader.move();

				return element;
			}

			if (reader.currToken[0] === DOLLAR) {
				var element = (new stylecow.Comparator())
					.setSource(reader)
					.setName('$=');

				reader.move();
				reader.move();

				return element;
			}

			if (reader.currToken[0] === ASTERISK) {
				var element = (new stylecow.Comparator())
					.setSource(reader)
					.setName('*=');

				reader.move();
				reader.move();

				return element;
			}
		}
	}

	static createRange (reader) {
		if (reader.currToken[0] === EQUALS) {
			reader.move();

			return (new stylecow.Comparator())
				.setSource(reader)
				.setName('=');
		}

		if (reader.currToken[0] === LESS_THAN) {
			if (reader.nextToken[0] === EQUALS) {
				var element = (new stylecow.Comparator())
					.setSource(reader)
					.setName('<=');

				reader.move();
				reader.move();

				return element;
			} else {
				reader.move();

				return (new stylecow.Comparator())
					.setSource(reader)
					.setName('<');
			}
		}

		if (reader.currToken[0] === GREATER_THAN) {
			if (reader.nextToken[0] === EQUALS) {
				var element = (new stylecow.Comparator())
					.setSource(reader)
					.setName('>=');

				reader.move();
				reader.move();

				return element;
			} else {
				reader.move();

				return (new stylecow.Comparator())
					.setSource(reader)
					.setName('>');
			}
		}
	}

	toString () {
		return this.name;
	}

	toCode (code) {
		code.appendStyle('comparator-before');
		code.append(this.name);
		code.appendStyle('comparator-after');
	}
}
