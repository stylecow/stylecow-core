"use strict";

const NAME  = Symbol.for('NAME');

var stylecow = require('../../index');

stylecow.TypeSelector = class extends require('../../classes/node-name') {

    constructor(data) {
        super(data, 'TypeSelector');
    }

    static create (reader) {
        if (reader.currToken === NAME) {
            return (new stylecow.TypeSelector(reader.data())).setName(reader.getStringAndMove());
        }
    }
}
