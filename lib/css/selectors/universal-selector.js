"use strict";

const ASTERISK = Symbol.for('ASTERISK');

var stylecow = require('../../index');

stylecow.UniversalSelector = class extends require('../../classes/node') {

    constructor(data) {
        super(data, 'UniversalSelector');
    }

    static create (reader) {
        if (reader.currToken === ASTERISK) {
            reader.move();

            return new stylecow.UniversalSelector(reader.data());
        }
    }

    toString () {
        return '*';
    }
}
