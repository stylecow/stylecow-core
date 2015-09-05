"use strict";

const COLON = Symbol.for('COLON');
const NAME  = Symbol.for('NAME');

var stylecow = require('../../index');

stylecow.PseudoClass = class extends require('../../classes/node-vendor') {

    constructor(data) {
        super(data, 'PseudoClass');
    }

    static create (reader) {
        if (reader.currToken === COLON && reader.nextToken === NAME) {
            reader.move();

            return (new stylecow.PseudoClass(reader.data())).setNameWithVendor(reader.getStringAndMove());
        }
    }

    toString () {
        return ':' + this.getNameWithVendor();
    }
}