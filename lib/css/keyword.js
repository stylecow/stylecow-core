"use strict";

const NAME = Symbol.for('NAME');

var stylecow = require('../index');

stylecow.Keyword = class Keyword extends require('./classes/node-vendor') {

    static create (reader, parent) {
        if (reader.currToken === NAME) {
            return (new stylecow.Keyword(reader.data())).setNameWithVendor(reader.getStringAndMove());
        }
    }

    constructor(data) {
        super(data, 'Keyword');
    }

    toString () {
        return this.getNameWithVendor();
    }
}