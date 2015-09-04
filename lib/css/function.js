"use strict";

const NAME              = Symbol.for('NAME');
const OPEN_PARENTHESIS  = Symbol.for('OPEN_PARENTHESIS');
const CLOSE_PARENTHESIS = Symbol.for('CLOSE_PARENTHESIS');
const COMMA             = Symbol.for('COMMA');
const STRING            = Symbol.for('STRING');

var stylecow = require('../index');

stylecow.Function = class extends require('../classes/node-collection-vendor') {

	constructor(data) {
		super(data, 'Function');
	}

	static create (reader) {
		if (reader.currToken === NAME && reader.nextToken === OPEN_PARENTHESIS) {
			var element = (new stylecow.Function(reader.data())).setNameWithVendor(reader.getStringAndMove());

			reader.move();

			do {
				element.push(stylecow.Value.create(reader) || reader.error());

			} while (reader.currToken === COMMA && reader.move());

			reader.skip(CLOSE_PARENTHESIS) || reader.error();

			return element;
		}
	}

	static createUrl (reader, fromString, names) {
		names = names || ['url'];

		//url()
		if (reader.currToken === NAME && reader.nextToken === OPEN_PARENTHESIS && (names.indexOf(reader.currStr) !== -1)) {
			var element = (new stylecow.Function(reader.data())).setName(reader.getStringAndMove());

			reader.move();


			// url("address")
			if (reader.currToken === STRING) {
				element.push(stylecow.String.create(reader) || reader.error());
			
			// url(address)
			} else if (reader.currToken !== CLOSE_PARENTHESIS) {
				var url = (new stylecow.String(reader.data())).setName('');

				do {
					url.name += reader.currStr;
				} while (reader.move() && reader.currToken !== CLOSE_PARENTHESIS);

				element.push(url);
			}

			reader.skip(CLOSE_PARENTHESIS) || reader.error();

			return element;
		}

		//"address"
		if (fromString && reader.currToken === STRING) {
			var element = (new stylecow.Function(reader.data())).setName('url');

			element.push(stylecow.String.create(reader) || reader.error());

			return element;
		}
	}

	toString () {
		return this.getNameWithVendor() + '(' + this.join(', ') + ')';
	}

	toCode (code) {
		code.append(this.getNameWithVendor() + '(', this);
		code.appendStyle('function-opening-parenthesis-after');

		var latest = this.length - 1;

		this.forEach(function (child, k) {
			child.toCode(code);

			if (k !== latest) {
				code.appendStyle('function-comma-before');
				code.append(',');
				code.appendStyle('function-comma-after');
			}
		});

		code.appendStyle('function-closing-parenthesis-before');
		code.append(')');
	}
}
