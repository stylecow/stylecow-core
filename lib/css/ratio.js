"use strict";

const NUMBER  = Symbol.for('NUMBER');
const NAME    = Symbol.for('NAME');
const SOLIDUS = Symbol.for('SOLIDUS');

let stylecow = require('../index');

stylecow.Ratio = class Ratio extends require('./classes/node-collection') {

    static create (reader, parent) {
        if (reader.currToken === NUMBER && reader.nextToken === SOLIDUS) {
            let element = new stylecow.Ratio(reader.data());

            element.push(stylecow.Number.create(reader, element) || reader.error());
            reader.skip(SOLIDUS) || reader.error();
            element.push(stylecow.Number.create(reader, element) || reader.error());

            return element;
        }
    }

    constructor(data) {
        super(data, 'Ratio');
    }

    toString () {
        return this.join('/');
    }

    toCode (code) {
        this[0].toCode(code);
        code.append('/');
        this[1].toCode(code);
    }
}
