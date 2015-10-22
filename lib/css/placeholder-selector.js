"use strict";

const PERCENTAGE = Symbol.for('PERCENTAGE');
const NAME       = Symbol.for('NAME');

let stylecow = require('../index');

stylecow.PlaceholderSelector = class PlaceholderSelector extends require('./classes/node-name') {

    static create (reader, parent) {
        if (reader.currToken === PERCENTAGE && reader.nextToken === NAME) {
            reader.move();

            return (new stylecow.PlaceholderSelector(reader.data())).setName(reader.getStringAndMove());
        }
    }

    constructor(data) {
        super(data, 'PlaceholderSelector');
    }

    toString () {
        return '%' + this.name;
    }
}
