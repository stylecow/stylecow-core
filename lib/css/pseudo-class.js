"use strict";

const COLON = Symbol.for('COLON');
const NAME  = Symbol.for('NAME');

var stylecow = require('../index');

stylecow.PseudoClass = class PseudoClass extends require('./classes/node-vendor') {

    static create (reader, parent) {
        if (reader.currToken === COLON && reader.nextToken === NAME) {
            reader.move();

            return (new stylecow.PseudoClass(reader.data())).setNameWithVendor(reader.getStringAndMove());
        }
    }

    constructor(data) {
        super(data, 'PseudoClass');
    }

    toString () {
        return ':' + this.getNameWithVendor();
    }
}
