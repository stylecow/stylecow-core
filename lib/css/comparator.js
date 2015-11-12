"use strict";

const EQUALS        = Symbol.for('EQUALS');
const TILDE         = Symbol.for('TILDE');
const VERTICAL_LINE = Symbol.for('VERTICAL_LINE');
const CARET         = Symbol.for('CARET');
const DOLLAR        = Symbol.for('DOLLAR');
const ASTERISK      = Symbol.for('ASTERISK');
const LESS_THAN     = Symbol.for('LESS_THAN');
const GREATER_THAN  = Symbol.for('GREATER_THAN');

const stylecow = require('../index');

stylecow.Comparator = class Comparator extends require('./classes/node-name') {

    static create (reader, parent) {
        if (reader.currToken === EQUALS) {
            reader.move();

            return (new stylecow.Comparator(reader.data())).setName('=');
        }

        if (reader.nextToken === EQUALS) {
            if (reader.currToken === TILDE) {
                let element = (new stylecow.Comparator(reader.data())).setName('~=');

                reader.move();
                reader.move();

                return element;
            }

            if (reader.currToken === VERTICAL_LINE) {
                let element = (new stylecow.Comparator(reader.data())).setName('|=');

                reader.move();
                reader.move();

                return element;
            }

            if (reader.currToken === CARET) {
                let element = (new stylecow.Comparator(reader.data())).setName('^=');

                reader.move();
                reader.move();

                return element;
            }

            if (reader.currToken === DOLLAR) {
                let element = (new stylecow.Comparator(reader.data())).setName('$=');

                reader.move();
                reader.move();

                return element;
            }

            if (reader.currToken === ASTERISK) {
                let element = (new stylecow.Comparator(reader.data())).setName('*=');

                reader.move();
                reader.move();

                return element;
            }
        }

        if (reader.currToken === LESS_THAN) {
            if (reader.nextToken === EQUALS) {
                let element = (new stylecow.Comparator(reader.data())).setName('<=');

                reader.move();
                reader.move();

                return element;
            } else {
                reader.move();

                return (new stylecow.Comparator(reader.data())).setName('<');
            }
        }

        if (reader.currToken === GREATER_THAN) {
            if (reader.nextToken === EQUALS) {
                let element = (new stylecow.Comparator(reader.data())).setName('>=');

                reader.move();
                reader.move();

                return element;
            } else {
                reader.move();

                return (new stylecow.Comparator(reader.data())).setName('>');
            }
        }
    }

    constructor(data) {
        super(data, 'Comparator');
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
