"use strict";

const HASH = Symbol.for('HASH');

var stylecow = require('../index');

stylecow.IdSelector = class extends require('./classes/node-name') {

    constructor(data) {
        super(data, 'IdSelector');
    }

    static create (reader) {
        if (reader.currToken === HASH) {
            return (new stylecow.IdSelector(reader.data())).setName(reader.getStringAndMove());
        }
    }

    toString () {
        return '#' + this.name;
    }
}