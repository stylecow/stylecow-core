"use strict";

const COLON = Symbol.for('COLON');
const NAME  = Symbol.for('NAME');

var stylecow = require('../index');

stylecow.ExtensionName = class extends require('./classes/node-name') {

    constructor(data) {
        super(data, 'ExtensionName');
    }

    static create (reader) {
        if (reader.currToken === NAME && reader.currStr.substr(0, 2) === '--') {
            return (new stylecow.ExtensionName(reader.data())).setName(reader.getStringAndMove().substr(2));
        }
    }

    static createFromCustomSelector (reader) {
        if (reader.currToken === COLON && reader.nextToken === NAME && reader.nextStr.substr(0, 2) === '--') {
            reader.move();

            return stylecow.ExtensionName.create(reader);
        }
    }

    toString () {
        return '--' +this.name;
    }
}