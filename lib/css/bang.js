"use strict";

const EXCLAMATION = Symbol.for('EXCLAMATION');
const NAME        = Symbol.for('NAME');
const COMMENT     = Symbol.for('COMMENT');

var stylecow = require('../index');

stylecow.Bang = class Bang extends require('./classes/node-name') {

    static create (reader, parent) {
        if (reader.currToken === EXCLAMATION) {
            reader.move();

            reader.skipAll(COMMENT);

            if (reader.currToken !== NAME) {
                reader.error();
            }

            return (new stylecow.Bang(reader.data())).setName(reader.getStringAndMove());
        }
    }

    constructor(data) {
        super(data, 'Bang');
    }

    toString () {
        return '!' + this.name;
    }
}
