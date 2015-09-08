"use strict";

const CLOSE_PARENTHESIS = Symbol.for('CLOSE_PARENTHESIS');
const EOF               = Symbol.for('EOF');

var stylecow = require('../index');

stylecow.ConditionalFeatureRange = class extends require('./classes/node-collection') {

    constructor(data) {
        super(data, 'ConditionalFeatureRange');
    }

    static create (reader) {
        var element = new stylecow.ConditionalFeatureRange(reader.data());

        do {
            element.push(
                    stylecow.Keyword.create(reader)
                 || stylecow.Unit.create(reader)
                 || stylecow.Comparator.createRange(reader)
                 || reader.error()
            );
        } while (reader.currToken !== CLOSE_PARENTHESIS && reader.currToken !== EOF);

        return element;
    }

    toString () {
        return this.join(' ');
    }

    toCode (code) {
        this.forEach(child => child.toCode(code));
    }
}
