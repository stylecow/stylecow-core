"use strict";

const NAME = Symbol.for('NAME');

var stylecow = require('../index');

stylecow.Keyword = class extends require('../classes/node-vendor') {

    constructor(data) {
        super(data, 'Keyword');
    }

    static create (reader) {
        if (reader.currToken === NAME) {
            return (new stylecow.Keyword(reader.data())).setNameWithVendor(reader.getStringAndMove());
        }
    }

    toString () {
        return this.getNameWithVendor();
    }

    toCode (code) {
        code.append(this.toString(), this);
    }
}