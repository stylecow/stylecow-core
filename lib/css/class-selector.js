"use strict";

const STOP = Symbol.for('STOP');
const NAME = Symbol.for('NAME');

var stylecow = require('../index');

stylecow.ClassSelector = class ClassSelector extends require('./classes/node-name') {

    static create (reader, parent) {
        if (reader.currToken === STOP && reader.nextToken === NAME) {
            reader.move();

            return (new stylecow.ClassSelector(reader.data()))
                .setName(reader.getStringAndMove());
        }
    }

    constructor(data) {
        super(data, 'ClassSelector');
    }

    toString () {
        return '.' + this.name;
    }
}
