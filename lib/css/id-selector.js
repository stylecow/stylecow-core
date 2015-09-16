"use strict";

const HASH = Symbol.for('HASH');

var stylecow = require('../index');

stylecow.IdSelector = class IdSelector extends require('./classes/node-name') {

    static create (reader, parent) {
        if (reader.currToken === HASH) {
            return (new stylecow.IdSelector(reader.data())).setName(reader.getStringAndMove());
        }
    }

    constructor(data) {
        super(data, 'IdSelector');
    }

    toString () {
        return '#' + this.name;
    }
}