"use strict";

const CLOSE_PARENTHESIS = Symbol.for('CLOSE_PARENTHESIS');
const NAME              = Symbol.for('NAME');
const WHITESPACE        = Symbol.for('WHITESPACE');

var stylecow = require('../index');

stylecow.ConditionalFeatureBoolean = class extends require('./classes/node-name') {

    static create (reader, parent) {
        if (reader.currToken === NAME && (reader.nextToken === CLOSE_PARENTHESIS || (reader.nextToken === WHITESPACE && reader.nextNextToken === CLOSE_PARENTHESIS))) {
            return (new stylecow.ConditionalFeatureBoolean(reader.data())).setName(reader.getStringAndMove());
        }
    }

    constructor(data) {
        super(data, 'ConditionalFeatureBoolean');
    }
}
