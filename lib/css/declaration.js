"use strict";

const COLON               = Symbol.for('COLON');
const NAME                = Symbol.for('NAME');
const ASTERISK            = Symbol.for('ASTERISK');
const COMMENT             = Symbol.for('COMMENT');
const COMMA               = Symbol.for('COMMA');
const EXCLAMATION         = Symbol.for('EXCLAMATION');
const SEMICOLON           = Symbol.for('SEMICOLON');
const EQUALS              = Symbol.for('EQUALS');
const CLOSE_CURLY_BRACKET = Symbol.for('CLOSE_CURLY_BRACKET');
const EOF                 = Symbol.for('EOF');

var stylecow = require('../index');

stylecow.Declaration = class extends require('../classes/node-collection-vendor') {

	constructor() {
		super('Declaration');
	}

	static create (reader) {
		var element;

		if (reader.currToken[0] === NAME) {
			element = (new stylecow.Declaration())
				.setSource(reader)
				.setNameWithVendor(reader.getAndMove()[3]);

		} else if (reader.currToken[0] === ASTERISK && reader.nextToken[0] === NAME) { //ie
			reader.move();

			element = (new stylecow.Declaration())
				.setSource(reader)
				.setNameWithVendor('*' + reader.getAndMove()[3]);
		} else {
			return;
		}

		reader.skipAll(COMMENT);
		reader.skip(COLON) || reader.error();

		do {
			element.push(stylecow.Value.create(reader) || reader.error());

		} while (reader.currToken[0] === COMMA && reader.move());

		if (reader.currToken[0] === EXCLAMATION) {
			element.push(stylecow.Bang.create(reader) || reader.error());
		}

		reader.skip(SEMICOLON);

		return element;
	}

	static createMsFilter (reader) {
		var element;

		if (reader.currToken[0] === NAME) {
			if (reader.currToken[3] !== 'filter' && reader.currToken[3] !== '-ms-filter') {
				return;
			}

			if (reader.currToken[3] === 'filter') {
				//Search by "=" before ";" to detect if it's a ms filter
				var offset = 0;

				while (true) {
					var token = reader.get(offset++);

					if (token[0] === EQUALS) {
						break;
					}

					//is a declaration
					if (token[0] === SEMICOLON || token[0] === CLOSE_CURLY_BRACKET) {
						return;
					}

					//end of file
					if (token[0] === EOF) {
						return reader.error();
					}
				}
			}

			reader.move();
			reader.skipAll(COMMENT);
			reader.skip(COLON) || reader.error();

			var element = (new stylecow.Declaration())
				.setSource(reader)
				.setName('filter')
				.setVendor('ms');

			var value = (new stylecow.Value()).setSource(reader);
			element.push(value);

			if (reader.currToken[0] === NAME && reader.currToken[3] === 'none') {
				value.push(stylecow.Keyword.create(reader) || reader.error());
			} else {
				var filter = (new stylecow.String())
					.setName('')
					.setSource(reader);

				value.push(filter);

				do {
					if (reader.currToken[0] !== COMMENT) {
						filter.name += reader.currToken[3];
					}
				} while (reader.move() && reader.currToken[0] !== SEMICOLON && reader.currToken[0] !== CLOSE_CURLY_BRACKET);
			}
		};

		if (reader.currToken[0] === EXCLAMATION) {
			element.push(stylecow.Bang.create(reader) || reader.error());
		}

		reader.skip(SEMICOLON);

		return element;
	}

	toString () {
		var string = this.getNameWithVendor() + ': ' + this.getChildren('Value').join(', ');

		if (this.hasChild('Bang')) {
			string += ' ' + this.getChild('Bang');
		}

		return string + ';';
	}

	toCode (code) {
		code.appendStyle('declaration-before');
		code.append(this.getNameWithVendor(), this);
		code.appendStyle('declaration-colon-before');
		code.append(':');
		code.appendStyle('declaration-colon-after');

		var values = this.getChildren('Value');
		var latest = values.length - 1;

		values.forEach(function (child, k) {
			child.toCode(code);

			if (k !== latest) {
				code.appendStyle('declaration-comma-before');
				code.append(',');
				code.appendStyle('declaration-comma-after');
			}
		});

		if (this.hasChild('Bang')) {
			code.append(' ');
			this.getChild('Bang').toCode(code);
		}

		code.append(';');
		code.appendStyle('declaration-after');
	}
}