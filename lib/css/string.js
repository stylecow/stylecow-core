"use strict";

const STRING = Symbol.for('STRING');

let stylecow = require('../index');

stylecow.String = class String extends require('./classes/node-name') {

    static create (reader, parent) {
        if (reader.currToken === STRING) {
            return (new stylecow.String(reader.data())).setName(reader.getStringAndMove());
        }
    }

    constructor(data) {
        super(data, 'String');
    }

    toString () {
        return '"' + this.name.replace(/(")/g, '\\$1') + '"';
    }

    toCode (code) {
        let q = code.get('string-quotes');

        code.append(q + this.name.replace(new RegExp('([' + q + '])', 'g'), '\\$1') + q, this);
    }
}
