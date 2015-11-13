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

const stylecow = require('../index');

stylecow.Declaration = class Declaration extends require('./classes/node-collection-vendor') {

    static create (reader, parent) {
        let element;

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

        //ms filter
        //Search by "=" before ";" to detect if it's a ms filter
        if (element.name === 'filter' && (element.vendor === 'ms' || reader.searchNext([CLOSE_CURLY_BRACKET, SEMICOLON, EQUALS, EOF]) === EQUALS)) {
            element.vendor = 'ms';

            let value = new stylecow.Value(reader.data());
            element.push(value);

            if (reader.currToken === NAME && reader.currStr === 'none') {
                value.push(stylecow.Keyword.create(reader, element) || reader.error());
            } else {
                let filter = (new stylecow.String(reader.data())).setName('');

                value.push(filter);

                do {
                    if (reader.currToken !== COMMENT) {
                        filter.name += reader.currStr;
                    }
                } while (reader.move() && reader.currToken !== SEMICOLON && reader.currToken !== CLOSE_CURLY_BRACKET);
            }
        } else {
            do {
                element.push(stylecow.Value.create(reader, element) || reader.error());

            } while (reader.skip(COMMA));
        }

        if (reader.currToken === EXCLAMATION) {
            element.push(stylecow.Bang.create(reader, element) || reader.error());
        }

        reader.skip(SEMICOLON);

        return element;
    }

    constructor(data) {
        super(data, 'Declaration');
    }

    toString () {
        let string = this.getNameWithVendor() + ': ' + this.getChildren('Value').join(', ');

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

        let values = this.getChildren('Value');
        let latest = values.length - 1;

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