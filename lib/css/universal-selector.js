"use strict";

const ASTERISK = Symbol.for('ASTERISK');

let stylecow = require('../index');

stylecow.UniversalSelector = class UniversalSelector extends require('./classes/node') {

    static create (reader, parent) {
        if (reader.currToken === ASTERISK) {
            reader.move();

            return new stylecow.UniversalSelector(reader.data());
        }
    }

    constructor(data) {
        super(data, 'UniversalSelector');
    }

    toString () {
        return '*';
    }
}
