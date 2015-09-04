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

	constructor(data) {
		super(data, 'Declaration');
	}

	static create (reader) {
		var element;

		if (reader.currToken === NAME) {
			element = (new stylecow.Declaration(reader.data())).setNameWithVendor(reader.getStringAndMove());

		} else if (reader.currToken === ASTERISK && reader.nextToken === NAME) { //ie
			reader.move();

			element = (new stylecow.Declaration(reader.data())).setNameWithVendor('*' + reader.getStringAndMove());
		} else {
			return;
		}

		reader.skipAll(COMMENT);
		reader.skip(COLON) || reader.error();

		do {
			element.push(stylecow.Value.create(reader) || reader.error());

		} while (reader.currToken === COMMA && reader.move());

		if (reader.currToken === EXCLAMATION) {
			element.push(stylecow.Bang.create(reader) || reader.error());
		}

		reader.skip(SEMICOLON);

		return element;
	}

	static createMsFilter (reader) {
		var element;

		if (reader.currToken === NAME) {
			if (reader.currStr !== 'filter' && reader.currStr !== '-ms-filter') {
				return;
			}

			if (reader.currStr === 'filter') {
				//Search by "=" before ";" to detect if it's a ms filter
				let token = reader.searchNext([CLOSE_CURLY_BRACKET, SEMICOLON, EQUALS, EOF]);

				//is a declaration
				if (token === SEMICOLON || token === CLOSE_CURLY_BRACKET) {
					return;
				}

				//end of file
				if (token === EOF) {
					return reader.error();
				}
			}

			reader.move();
			reader.skipAll(COMMENT);
			reader.skip(COLON) || reader.error();

			var element = (new stylecow.Declaration(reader.data()))
				.setName('filter')
				.setVendor('ms');

			var value = new stylecow.Value(reader.data());
			element.push(value);

			if (reader.currToken === NAME && reader.currStr === 'none') {
				value.push(stylecow.Keyword.create(reader) || reader.error());
			} else {
				var filter = (new stylecow.String(reader.data())).setName('');

				value.push(filter);

				do {
					if (reader.currToken !== COMMENT) {
						filter.name += reader.currStr;
					}
				} while (reader.move() && reader.currToken !== SEMICOLON && reader.currToken !== CLOSE_CURLY_BRACKET);
			}
		};

		if (reader.currToken === EXCLAMATION) {
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