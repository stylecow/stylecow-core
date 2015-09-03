"use strict";

var stylecow = require('../index');

stylecow.Comparator = class extends require('../classes/node-name') {

	constructor() {
		super('Comparator');
	}

	static createMatch (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.EQUALS) {
			reader.move();

			return (new stylecow.Comparator())
				.setSource(reader)
				.setName('=');
		}

		if (reader.nextToken[0] === t.EQUALS) {
			if (reader.currToken[0] === t.TILDE) {
				var element = (new stylecow.Comparator())
					.setSource(reader)
					.setName('~=');

				reader.move();
				reader.move();

				return element;
			}

			if (reader.currToken[0] === t.VERTICAL_LINE) {
				var element = (new stylecow.Comparator())
					.setSource(reader)
					.setName('|=');

				reader.move();
				reader.move();

				return element;
			}

			if (reader.currToken[0] === t.CARET) {
				var element = (new stylecow.Comparator())
					.setSource(reader)
					.setName('^=');

				reader.move();
				reader.move();

				return element;
			}

			if (reader.currToken[0] === t.DOLLAR) {
				var element = (new stylecow.Comparator())
					.setSource(reader)
					.setName('$=');

				reader.move();
				reader.move();

				return element;
			}

			if (reader.currToken[0] === t.ASTERISK) {
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
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.EQUALS) {
			reader.move();

			return (new stylecow.Comparator())
				.setSource(reader)
				.setName('=');
		}

		if (reader.currToken[0] === t.LESS_THAN) {
			if (reader.nextToken[0] === t.EQUALS) {
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

		if (reader.currToken[0] === t.GREATER_THAN) {
			if (reader.nextToken[0] === t.EQUALS) {
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
