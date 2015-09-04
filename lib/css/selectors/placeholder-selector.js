"use strict";

const PERCENTAGE = Symbol.for('PERCENTAGE');
const NAME       = Symbol.for('NAME');

var stylecow = require('../../index');

stylecow.PlaceholderSelector = class extends require('../../classes/node-name') {

    constructor(data) {
        super(data, 'PlaceholderSelector');
    }

    static create (reader) {
        if (reader.currToken === PERCENTAGE && reader.nextToken === NAME) {
            reader.move();

            return (new stylecow.PlaceholderSelector(reader.data())).setName(reader.getStringAndMove());
        }
    }

    toString () {
        return '%' + this.name;
    }

    toCode (code) {
        code.append(this.toString(), this);
    }
}
