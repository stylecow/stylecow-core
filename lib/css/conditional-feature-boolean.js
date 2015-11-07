"use strict";

const CLOSE_PARENTHESIS = Symbol.for('CLOSE_PARENTHESIS');
const NAME              = Symbol.for('NAME');

let stylecow = require('../index');

stylecow.ConditionalFeatureBoolean = class ConditionalFeatureBoolean extends require('./classes/node-name') {

    static create (reader, parent) {
        if (reader.currToken === NAME && reader.nextToken === CLOSE_PARENTHESIS) {
            return (new stylecow.ConditionalFeatureBoolean(reader.data())).setName(reader.getStringAndMove());
        }
    }

    constructor(data) {
        super(data, 'ConditionalFeatureBoolean');
    }
}
