"use strict";

const HASH = Symbol.for('HASH');

var stylecow = require('../index');

stylecow.Hex = class Hex extends require('./classes/node-name') {

    static create (reader, parent) {
        if (reader.currToken === HASH) {
            if (/^[0-9a-fA-F]+$/.test(reader.currStr)) {
                return (new stylecow.Hex(reader.data())).setName(reader.getStringAndMove());
            }

            reader.error();
        }
    }

    constructor(data) {
        super(data, 'Hex');
    }

    toString () {
        return '#' + this.name;
    }
}