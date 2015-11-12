"use strict";

const NAME  = Symbol.for('NAME');

const stylecow = require('../index');

stylecow.TypeSelector = class TypeSelector extends require('./classes/node-name') {

    static create (reader, parent) {
        if (reader.currToken === NAME) {
            return (new stylecow.TypeSelector(reader.data())).setName(reader.getStringAndMove());
        }
    }

    constructor(data) {
        super(data, 'TypeSelector');
    }
}
