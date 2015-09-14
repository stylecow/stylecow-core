"use strict";

const CLOSE_PARENTHESIS = Symbol.for('CLOSE_PARENTHESIS');
const EOF               = Symbol.for('EOF');

var stylecow = require('../index');

stylecow.ConditionalFeatureRange = class extends require('./classes/node-collection') {

    static create (reader, parent) {
        var element = new stylecow.ConditionalFeatureRange(reader.data());

        do {
            element.push(
                    stylecow.Keyword.create(reader, element)
                 || stylecow.Unit.create(reader, element)
                 || stylecow.Comparator.create(reader, element)
                 || reader.error()
            );
        } while (reader.currToken !== CLOSE_PARENTHESIS && reader.currToken !== EOF);

        return element;
    }

    constructor(data) {
        super(data, 'ConditionalFeatureRange');
    }

    toString () {
        return this.join(' ');
    }

    toCode (code) {
        this.forEach(child => child.toCode(code));
    }
}
