"use strict";

const COLON = Symbol.for('COLON');
const NAME  = Symbol.for('NAME');

var stylecow = require('../index');

stylecow.ExtensionName = class extends require('./classes/node-name') {

    static create (reader, parent) {
        if (reader.currToken === NAME && reader.currStr.substr(0, 2) === '--') {
            return (new stylecow.ExtensionName(reader.data())).setName(reader.getStringAndMove().substr(2));
        }

        if (reader.currToken === COLON && reader.nextToken === NAME && reader.nextStr.substr(0, 2) === '--') {
            reader.move();

            return stylecow.ExtensionName.create(reader, parent);
        }
    }

    constructor(data) {
        super(data, 'ExtensionName');
    }

    toString () {
        return '--' +this.name;
    }
}